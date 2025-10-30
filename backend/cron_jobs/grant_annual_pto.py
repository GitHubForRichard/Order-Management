import uuid

from constants import AuditLogActions
from datetime import date, datetime, timezone
from models import AuditLog, UserLeaveHours, db, User

HOURS_PER_DAY = 8

def grant_annual_pto(app):
    """Grant PTO based on service years and carryover rules"""
    with app.app_context():
        print("Granting annual PTO...")
        today = date.today()
        users = User.query.all()

        for user in users:
            if not user.join_date:
                continue

            user_name = f"{user.first_name} {user.last_name}"

            # Calculate service years
            service_years = today.year - user.join_date.year
            # Check if anniversary is today
            anniversary = user.join_date.replace(year=today.year)
            if anniversary != today:
                print(f"Anniversary not yet reached for user {user_name} ({anniversary})")
                continue

            # PTO calculation
            pto_for_year = (7 + service_years) * HOURS_PER_DAY # First year = 7 days, +1 per year

            # Fetch or create user's PTO record
            user_leave_hours = UserLeaveHours.query.filter_by(user_id=user.id).first()
            if not user_leave_hours:
                user_leave_hours = UserLeaveHours(user_id=user.id, remaining_hours=0)
                db.session.add(user_leave_hours)

            # Apply carryover: max 5 unused days
            prev_remaining_hours = user_leave_hours.remaining_hours
            carryover = min(prev_remaining_hours, 5 * HOURS_PER_DAY)
            user_leave_hours.remaining_hours = min(carryover + pto_for_year, 14 * HOURS_PER_DAY)

            print(f"Granting PTO for user {user_name}: {carryover} hours carryover + {pto_for_year} hours PTO for year")

            # Log the action
            audit_log = AuditLog(
                id=str(uuid.uuid4()),
                entity=UserLeaveHours.__tablename__,
                entity_id=str(user.id),
                action=AuditLogActions.UPDATED,
                field="remaining_hours",
                new_value=str(carryover + pto_for_year),
                old_value=str(prev_remaining_hours),
                created_by=user.id,
                created_at=datetime.now(timezone.utc)
            )
            db.session.add(audit_log)

        db.session.commit()