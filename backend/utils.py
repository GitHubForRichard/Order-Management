import csv
import io
import pandas as pd
import re
import uuid

from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from config import EMPLOYEE_CSV_FILE_PATH
from models import AuditLog, Case, Customer, User, db

PACIFIC = ZoneInfo("America/Los_Angeles")


def to_snake_case(text: str) -> str:
    # Replace spaces or hyphens with underscores
    text = re.sub(r'[\s\-]+', '_', text)

    # Insert underscore before any uppercase letter (not at start)
    text = re.sub(r'(?<!^)(?=[A-Z])', '_', text)

    # Lowercase everything
    text = text.lower()

    # Remove any duplicate underscores
    text = re.sub(r'_+', '_', text)

    # Strip leading/trailing underscores
    return text.strip('_')


def update_fields(model_instance, updated_data, action, user_id, entity_name=None, immutable_fields=None):
    """
    Create AuditLog entries for changed fields on a SQLAlchemy model.

    :param model_instance: The SQLAlchemy model instance being updated
    :param action: The action performed on this log
    :param updated_data: Dict of updated values (e.g. request.get_json())
    :param user_id: UUID of the user performing the update
    :param entity_name: Optional string name of the entity/table. Defaults to model_instance.__tablename__
    :param immutable_fields: Optional set of fields to ignore (like id, created_at)
    """
    if entity_name is None:
        entity_name = getattr(model_instance, "__tablename__",
                              model_instance.__class__.__name__)

    audit_logs = []

    for field, new_value in updated_data.items():
        if hasattr(model_instance, field) and field not in immutable_fields:
            old_value = getattr(model_instance, field)
            if str(old_value) != str(new_value):
                setattr(model_instance, field, new_value)
                audit_logs.append(AuditLog(
                    id=uuid.uuid4(),
                    action=action,
                    entity=entity_name,
                    entity_id=model_instance.id,
                    field=field,
                    old_value=str(
                        old_value) if old_value is not None else None,
                    new_value=str(
                        new_value) if new_value is not None else None,
                    created_by=user_id,
                    created_at=datetime.now(timezone.utc)
                ))

    if audit_logs:
        db.session.add_all(audit_logs)


def get_case_assignees():
    assignees = []
    if EMPLOYEE_CSV_FILE_PATH:
        df = pd.read_csv(EMPLOYEE_CSV_FILE_PATH)

        # Ensure the CSV has the right headers
        if "Employee Name" in df.columns and "Employee Email" in df.columns:
            assignees = [
                {"name": row["Employee Name"], "email": row["Employee Email"]}
                for _, row in df.iterrows()
                if pd.notna(row["Employee Name"]) and pd.notna(row["Employee Email"])
            ]

    return assignees

def count_weekdays(start: date, end: date) -> int:
    days = 0
    current = start
    while current <= end:
        if current.weekday() < 5:
            days += 1
        current += timedelta(days=1)
    return days


def format_utc_to_pst(value):
    """Format a naive UTC to human-readable time"""
    if not value:
        return ""
    return value.replace(tzinfo=timezone.utc).astimezone(PACIFIC).strftime("%m/%d/%Y, %I:%M:%S %p")


def format_full_name(person):
    return f"{person.first_name or ''} {person.last_name or ''}".strip()


def format_csv_header(column_name):
    """e.g. zip_code -> Zip Code"""
    return column_name.replace("_", " ").title()


def format_csv_value(value):
    if value is None:
        return ""
    if isinstance(value, bool):
        return "Yes" if value else "No"
    if isinstance(value, datetime):
        return format_utc_to_pst(value)
    return value


# Columns excluded to display on the CSV
CASE_CSV_EXCLUDED_COLUMNS = {"id", "customer_id"}
CUSTOMER_CSV_EXCLUDED_COLUMNS = {"id", "created_by", "created_at", "updated_at"}


def build_cases_csv():
    """Build a CSV of all cases with every Case and Customer column. Returns (csv_text, case_count)."""
    cases = (
        db.session.query(Case, Customer, User)
        .join(Customer, Case.customer_id == Customer.id)
        .join(User, Case.created_by == User.id)
        .order_by(Case.created_at.desc())
        .all()
    )

    case_columns = [c.key for c in Case.__table__.columns if c.key not in CASE_CSV_EXCLUDED_COLUMNS]
    customer_columns = [c.key for c in Customer.__table__.columns if c.key not in CUSTOMER_CSV_EXCLUDED_COLUMNS]

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        [format_csv_header(key) for key in case_columns]
        + [f"Customer {format_csv_header(key)}" for key in customer_columns]
    )
    for case, customer, user in cases:
        writer.writerow(
            # created_by is a user ID, so show the user's name instead
            [format_full_name(user) if key == "created_by" else format_csv_value(getattr(case, key))
             for key in case_columns]
            + [format_csv_value(getattr(customer, key)) for key in customer_columns]
        )

    return output.getvalue(), len(cases)