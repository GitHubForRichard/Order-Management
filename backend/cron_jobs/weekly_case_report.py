from datetime import date

from config import MAIL_USERNAME
from constants import WEEKLY_CASE_REPORT_EMAIL
from emailer import send_email
from models import ScriptRunLog, db
from utils import build_cases_csv

SCRIPT_NAME = "weekly_case_report"


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
