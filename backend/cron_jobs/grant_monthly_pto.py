import uuid
from datetime import date, datetime, timezone
from calendar import monthrange
from dateutil.relativedelta import relativedelta

from constants import AuditLogActions
from models import AuditLog, ScriptRunLog, UserLeaveHours, db, User

HOURS_PER_DAY = 8

# Monthly PTO accrual in HOURS by years worked
PTO_ACCRUAL_BY_YEARS = {
    0: 4.67,
    1: 5.34,
    2: 6.00,
    3: 6.67,
    4: 7.34,
    5: 8.00,
    6: 8.67,
    7: 9.34,
}

# Maximum carryover per year (in days)
CARRYOVER_CAP_DAYS = 7

PROBATION_MONTHS = 3  # Skip accrual during first 3 months

def calculate_advanced_pto_for_year(
    effective_start_date: date,
    target_year: int,
) -> float:
    """
    Calculate total PTO hours advanced in a given year,
    accounting for accrual rate change on annual anniversary.
    """
    # Not eligible yet
    if effective_start_date.year > target_year:
        return 0.0

    year_start = date(target_year, 1, 1)
    year_end = date(target_year, 12, 31)

    # Anniversary in target year
    try:
        anniversary = effective_start_date.replace(year=target_year)
    except ValueError:
        anniversary = effective_start_date.replace(year=target_year, day=28)

    total_hours = 0.0

    # ---- Before anniversary (old rate) ----
    print(f"Running rate calculation before anniversary on {anniversary}")

    # Number of months before anniversary in the year (exclusive)
    months_before = (
        anniversary.month - year_start.month
    )
    print(f"Months before anniversary: {months_before}")

    years_worked_before = calculate_years_worked(
        effective_start_date,
        year_start,
    )
    print(f"Years worked before anniversary: {years_worked_before}")

    rate_before = PTO_ACCRUAL_BY_YEARS.get(
        min(years_worked_before, 7), 0
    )
    print(f"Accrual rate before anniversary: {rate_before} hours/month")

    total_hours += rate_before * months_before
    print(f"Total hours before anniversary (accrual rate x months): {total_hours}")

    # ---- On / after anniversary (new rate) ----
    print(f"Running rate calculation after anniversary on {anniversary}")

    if anniversary <= year_end:
        # Number of months after (and including) anniversary in the year
        months_after = year_end.month - anniversary.month + 1
        print(f"Months after anniversary: {months_after}")

        years_worked_after = calculate_years_worked(
            effective_start_date,
            year_end,
        )
        print(f"Years worked after anniversary: {years_worked_after}")

        rate_after = PTO_ACCRUAL_BY_YEARS.get(
            min(years_worked_after, 7), 0
        )
        print(f"Accrual rate after anniversary: {rate_after} hours/month")

        print(f"Total hours after anniversary (accrual rate x months): {rate_after * months_after}")
        
        total_hours += rate_after * months_after

    return round(total_hours, 2)

def calculate_years_worked(start_date: date, today: date) -> int:
    """Calculate full years worked from effective start date"""
    years = today.year - start_date.year
    if (today.month, today.day) < (start_date.month, start_date.day):
        years -= 1
    return max(years, 0)

def calculate_carry_over(user: User, user_leave_hours: UserLeaveHours):
    """Calculate and apply year-end PTO carryover with a flat 7-day cap"""
    user_name = f"{user.first_name} {user.last_name}"
    
    carryover_hours = min(user_leave_hours.remaining_hours, CARRYOVER_CAP_DAYS * HOURS_PER_DAY)
    
    pre_carryover_hours = user_leave_hours.remaining_hours
    user_leave_hours.remaining_hours = carryover_hours
    
    print(f"Year-end carryover applied for {user_name}: {carryover_hours:.2f} hours")
    
    # Audit log for carryover
    audit_log = AuditLog(
        id=str(uuid.uuid4()),
        entity=UserLeaveHours.__tablename__,
        entity_id=str(user.id),
        action=AuditLogActions.UPDATED,
        field="remaining_hours",
        old_value=str(pre_carryover_hours),
        new_value=str(user_leave_hours.remaining_hours),
        created_by=user.id,
        created_at=datetime.now(timezone.utc),
    )
    db.session.add(audit_log)

def get_user_effective_start_date(user: User) -> date:
    """Get the effective PTO start date after probation"""
    if not user.join_date:
        raise ValueError("User has no join date")
    return user.join_date + relativedelta(months=PROBATION_MONTHS)

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

        # Prevent multiple script runs
        log = ScriptRunLog.query.filter_by(script_name="grant_monthly_pto").first()
        if log and log.last_run_date == today:
            print("PTO script has already run today, exiting.")
            return
        elif not log:
            log = ScriptRunLog(script_name="grant_monthly_pto", last_run_date=None)
            db.session.add(log)
            db.session.flush()

        # Update last_run_date early to prevent duplicate runs
        log.last_run_date = today


        users = User.query.all()

        for user in users:
            print(f"------------- Processing user {user.first_name} {user.last_name} -------------")

            if not user.join_date:
                print(f"Skipping PTO for {user.first_name} {user.last_name} with no join date")
                continue

            # Compute the effective start date after probation
            effective_start_date = get_user_effective_start_date(user)

            # Skip users still in probation
            if today < effective_start_date:
                print(f"Skipping PTO for {user.first_name} {user.last_name} (still in probation)")
                continue

            user_name = f"{user.first_name} {user.last_name}"
            years_worked = calculate_years_worked(effective_start_date, today)

            print(f"Effective start date: {effective_start_date}")
            print(f"Years worked: {years_worked}")

            accrual_hours = PTO_ACCRUAL_BY_YEARS.get(min(years_worked, 7), 0)

            # Fetch or create PTO record
            user_leave_hours = UserLeaveHours.query.filter_by(user_id=user.id).first()
            if not user_leave_hours:
                print(f"Unable to find PTO record for {user_name}, creating a new record")
                user_leave_hours = UserLeaveHours(user_id=user.id, remaining_hours=0, advanced_remaining_hours=0)
                db.session.add(user_leave_hours)
                db.session.flush()  # ensure we get the ID

            prev_remaining_hours = user_leave_hours.remaining_hours

            if today.month == 1 and today.day == 1:
                # Calculate advanced PTO for the year on Jan 1st
                print(f"Calculating advanced PTO for {user_name} on Jan 1st")
                advanced_pto = calculate_advanced_pto_for_year(effective_start_date, today.year)
                prev_advanced_remaining_hours = user_leave_hours.advanced_remaining_hours
                user_leave_hours.advanced_remaining_hours = advanced_pto
                print(f"Advanced PTO for {user_name} on Jan 1: {advanced_pto:.2f} hours")

                # Audit log for advanced remaining hours
                audit_log = AuditLog(
                    id=str(uuid.uuid4()),
                    entity=UserLeaveHours.__tablename__,
                    entity_id=str(user.id),
                    action=AuditLogActions.UPDATED,
                    field="advanced_remaining_hours",
                    old_value=str(prev_advanced_remaining_hours),
                    new_value=str(user_leave_hours.advanced_remaining_hours),
                    created_by=user.id,
                    created_at=datetime.now(timezone.utc),
                )
                db.session.add(audit_log)

                # Apply year-end carryover cap
                calculate_carry_over(user, user_leave_hours)


            # Only grant PTO on monthly anniversary
            if not is_monthly_anniversary(effective_start_date, today):
                print(f"Skipping PTO for {user_name} (not monthly anniversary)")
                continue

            # Add monthly accrual
            user_leave_hours.remaining_hours = round(
                user_leave_hours.remaining_hours + accrual_hours,
                2
            )

            # After adding monthly accrual to the current balance,
            # deduct from advanced_remaining_hours if available because
            # advanced PTO is granted in the first place to cover future accruals.
            if user_leave_hours.advanced_remaining_hours > 0:
                user_leave_hours.advanced_remaining_hours = round(
                    user_leave_hours.advanced_remaining_hours - accrual_hours,
                    2
                )


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