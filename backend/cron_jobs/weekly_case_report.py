import csv
import io
from datetime import date, timezone
from zoneinfo import ZoneInfo

from config import MAIL_USERNAME
from constants import WEEKLY_CASE_REPORT_EMAIL
from emailer import send_email
from models import Case, Customer, ScriptRunLog, User, db

SCRIPT_NAME = "weekly_case_report"

PACIFIC = ZoneInfo("America/Los_Angeles")

CSV_HEADERS = [
    "Full name",
    "Case Number",
    "Model Number",
    "Issues",
    "Status",
    "Assign to",
    "Recorded By",
    "Created Date",
    "Last Updated",
]


def format_utc_to_pst(value):
    """Format a naive UTC to human-readable time"""
    if not value:
        return ""
    return value.replace(tzinfo=timezone.utc).astimezone(PACIFIC).strftime("%m/%d/%Y, %I:%M:%S %p")


def format_full_name(person):
    return f"{person.first_name or ''} {person.last_name or ''}".strip()


def build_cases_csv():
    """Build a CSV of all cases"""
    cases = (
        db.session.query(Case, Customer, User)
        .join(Customer, Case.customer_id == Customer.id)
        .join(User, Case.created_by == User.id)
        .order_by(Case.created_at.desc())
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(CSV_HEADERS)
    for case, customer, user in cases:
        writer.writerow([
            format_full_name(customer),
            case.case_number or "",
            case.model_number or "",
            case.issues or "",
            case.status or "",
            case.assign or "",
            format_full_name(user),
            format_utc_to_pst(case.created_at),
            format_utc_to_pst(case.updated_at),
        ])

    return output.getvalue(), len(cases)


def send_weekly_case_report(app):
    """Email the full case list as a CSV attachment"""
    with app.app_context():
        today = date.today()
        print(f"Running weekly case report for {today}")

        # Prevent multiple script runs
        log = ScriptRunLog.query.filter_by(script_name=SCRIPT_NAME).first()
        if log and log.last_run_date == today:
            print("Weekly case report has already run today, exiting.")
            return
        elif not log:
            log = ScriptRunLog(script_name=SCRIPT_NAME, last_run_date=None)
            db.session.add(log)
            db.session.flush()

        # Commit last_run_date before sending so a second scheduler process skips it
        log.last_run_date = today
        db.session.commit()

        csv_text, case_count = build_cases_csv()

        send_email(
            subject=f"Weekly case list - {today.strftime('%m/%d/%Y')}",
            recipients=[WEEKLY_CASE_REPORT_EMAIL],
            body=(
                "Hi,\n\n"
                f"Attached is the weekly case list with {case_count} cases.\n"
            ),
            sender=MAIL_USERNAME,
            attachments=[(f"cases_{today.isoformat()}.csv", "text/csv", csv_text)],
        )
        print(f"Weekly case report sent to {WEEKLY_CASE_REPORT_EMAIL}")
