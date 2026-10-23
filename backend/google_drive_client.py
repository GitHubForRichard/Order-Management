import os
import io
import logging
import ssl
import threading

from datetime import datetime
from werkzeug.utils import secure_filename
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from google.oauth2 import service_account

# Google Service Account Setup
SCOPES = ["https://www.googleapis.com/auth/drive.file"]
SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_DRIVE_CRED_FILE_PATH")
FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID")
CHUNK_SIZE = 1024 * 1024
NUM_RETRIES = 3
MAX_CONNECTION_FAILURES = 10

logger = logging.getLogger(__name__)

creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)


_thread_local = threading.local()


def get_drive_service():
    if not hasattr(_thread_local, "service"):
        _thread_local.service = build("drive", "v3", credentials=creds)
    return _thread_local.service


def reset_drive_service():
    _thread_local.__dict__.pop("service", None)


def get_web_view_link(file_id):
    file = get_drive_service().files().get(
        fileId=file_id,
        fields="webViewLink",
        supportsAllDrives=True
    ).execute(num_retries=NUM_RETRIES)
    return file["webViewLink"]


def upload_file_to_google_drive(file_obj):
    file_name = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file_obj.filename}"
    file_name = secure_filename(file_name)

    media = MediaIoBaseUpload(
        file_obj,
        mimetype=file_obj.mimetype or "application/octet-stream",
        chunksize=CHUNK_SIZE,
        resumable=True,
    )

    # File metadata: put inside a Drive folder if needed
    file_metadata = {
        "name": file_name,
        "parents": [FOLDER_ID] if FOLDER_ID else []
    }

    request = get_drive_service().files().create(
        body=file_metadata,
        media_body=media,
        fields="id, webViewLink",
        supportsAllDrives=True,
    )

    uploaded_file = None
    failures = 0
    while uploaded_file is None:
        try:
            _, uploaded_file = request.next_chunk(num_retries=NUM_RETRIES)
        except (ssl.SSLError, ConnectionError) as e:
            failures += 1
            logger.warning("Drive upload connection error (%d/%d): %s", failures, MAX_CONNECTION_FAILURES, e)
            if failures >= MAX_CONNECTION_FAILURES:
                raise
            reset_drive_service()
            request.http = get_drive_service()._http

    return {
        "message": "File uploaded",
        "file_name": file_name,
        "file_id": uploaded_file["id"],
        "link": uploaded_file["webViewLink"]
    }
