import uuid
from datetime import date, datetime, timezone

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


def calculate_years_worked(join_date: date, today: date) -> int:
    """Accurate full years worked"""
    years = today.year - join_date.year
    if (today.month, today.day) < (join_date.month, join_date.day):
        years -= 1
    return max(years, 0)


def grant_monthly_pto(app):
    """Grant PTO monthly with carryover reset at anniversary"""
    with app.app_context():
        print("Granting monthly PTO...")
        today = date.today()

        users = User.query.all()

        for user in users:
            if not user.join_date:
                continue

            user_name = f"{user.first_name} {user.last_name}"
            years_worked = calculate_years_worked(user.join_date, today)

            # Monthly accrual hours
            accrual_days = PTO_ACCRUAL_BY_YEARS.get(min(years_worked, 7))
            accrual_hours = accrual_days * HOURS_PER_DAY

            # Fetch or create PTO record
            user_leave_hours = UserLeaveHours.query.filter_by(user_id=user.id).first()
            if not user_leave_hours:
                user_leave_hours = UserLeaveHours(user_id=user.id, remaining_hours=0)
                db.session.add(user_leave_hours)

            prev_remaining_hours = user_leave_hours.remaining_hours

            # Check if today is employee anniversary
            anniversary = user.join_date.replace(year=today.year)
            if today == anniversary:
                # Reset remaining PTO to carryover cap
                carryover_days = CARRYOVER_CAP_BY_YEAR.get(min(years_worked, 7), 7)
                carryover_hours = min(user_leave_hours.remaining_hours, carryover_days * HOURS_PER_DAY)
                user_leave_hours.remaining_hours = carryover_hours
                print(f"Carryover applied for {user_name}: {carryover_hours:.2f} hours (anniversary)")

            # Add monthly accrual
            user_leave_hours.remaining_hours += accrual_hours

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