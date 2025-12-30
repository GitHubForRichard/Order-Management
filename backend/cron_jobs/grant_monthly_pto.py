import uuid
from datetime import date, datetime, timezone
from calendar import monthrange
from dateutil.relativedelta import relativedelta

from constants import AuditLogActions
from models import AuditLog, UserLeaveHours, db, User

HOURS_PER_DAY = 8

# Monthly PTO accrual by years worked
PTO_ACCRUAL_BY_YEARS = {
    0: 0.58,
    1: 0.67,
    2: 0.75,
    3: 0.83,
    4: 0.92,
    5: 1.00,
    6: 1.08,
    7: 1.17,
}

# Maximum carryover per year (in days)
CARRYOVER_CAP_BY_YEAR = {
    0: 3.5,
    1: 4.0,
    2: 4.5,
    3: 5.0,
    4: 5.5,
    5: 6.0,
    6: 6.5,
    7: 7.0,
}

PROBATION_MONTHS = 3  # Skip accrual during first 3 months


def calculate_years_worked(start_date: date, today: date) -> int:
    """Calculate full years worked from effective start date"""
    years = today.year - start_date.year
    if (today.month, today.day) < (start_date.month, start_date.day):
        years -= 1
    return max(years, 0)


def is_monthly_anniversary(start_date: date, today: date) -> bool:
    """Check if today is the employee's monthly PTO accrual date based on effective start date"""
    day = start_date.day
    last_day_of_month = monthrange(today.year, today.month)[1]
    return today.day == min(day, last_day_of_month)


def grant_monthly_pto(app):
    """Grant PTO for employees based on effective start date after probation"""
    with app.app_context():
        today = date.today()
        print(f"Running PTO accrual for {today}")

        users = User.query.all()

        for user in users:
            print(f"Processing user {user.first_name} {user.last_name}")

            if not user.join_date:
                print(f"Skipping PTO for {user.first_name} {user.last_name} with no join date")
                continue

            # Compute probation end date
            probation_end = user.join_date + relativedelta(months=PROBATION_MONTHS)

            # Skip users still in probation
            if today < probation_end:
                print(f"Skipping PTO for {user.first_name} {user.last_name} (still in probation)")
                continue

            effective_start_date = probation_end
            user_name = f"{user.first_name} {user.last_name}"
            years_worked = calculate_years_worked(effective_start_date, today)

            print(f"Effective start date: {effective_start_date}")
            print(f"Years worked: {years_worked}")

            # Only grant PTO on monthly anniversary
            if not is_monthly_anniversary(effective_start_date, today):
                print(f"Skipping PTO for {user_name} (not monthly anniversary)")
                continue

            accrual_days = PTO_ACCRUAL_BY_YEARS.get(min(years_worked, 7), 0)
            accrual_hours = accrual_days * HOURS_PER_DAY

            # Fetch or create PTO record
            user_leave_hours = UserLeaveHours.query.filter_by(user_id=user.id).first()
            if not user_leave_hours:
                print(f"Unable to find PTO record for {user_name}, creating a new record")
                user_leave_hours = UserLeaveHours(user_id=user.id, remaining_hours=0, last_accrual_date=None)
                db.session.add(user_leave_hours)
                db.session.flush()  # ensure we get the ID

            # Prevent double accrual in a single day
            if user_leave_hours.last_accrual_date == today:
                print(f"Skipping {user_name}, PTO script has been applied to this user today already")
                continue

            prev_remaining_hours = user_leave_hours.remaining_hours

            # Apply year-end carryover on Dec 31
            if today.month == 12 and today.day == 31:
                carryover_days = CARRYOVER_CAP_BY_YEAR.get(min(years_worked, 7), 7)
                carryover_hours = min(user_leave_hours.remaining_hours, carryover_days * HOURS_PER_DAY)
                user_leave_hours.remaining_hours = carryover_hours
                print(f"Year-end carryover applied for {user_name}: {carryover_hours:.2f} hours")

            # Add monthly accrual
            user_leave_hours.remaining_hours = round(
                user_leave_hours.remaining_hours + accrual_hours,
                2
            )
            # Update last accrual date
            user_leave_hours.last_accrual_date = today

            print(
                f"User {user_name}: +{accrual_hours:.2f} hours "
                f"(Years worked: {years_worked}, Previous: {prev_remaining_hours:.2f}, "
                f"New: {user_leave_hours.remaining_hours:.2f})"
            )

            # Audit log
            audit_log = AuditLog(
                id=str(uuid.uuid4()),
                entity=UserLeaveHours.__tablename__,
                entity_id=str(user.id),
                action=AuditLogActions.UPDATED,
                field="remaining_hours",
                old_value=str(prev_remaining_hours),
                new_value=str(user_leave_hours.remaining_hours),
                created_by=user.id,
                created_at=datetime.now(timezone.utc),
            )
            db.session.add(audit_log)

        db.session.commit()


if __name__ == "__main__":
    from app import app
    grant_monthly_pto(app)