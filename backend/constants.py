import os

from enum import Enum

DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "supersecure")
DB_HOST = os.getenv("POSTGRES_HOST", "postgres")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "postgres")


class AuditLogActions(str, Enum):
    CREATED = "CREATED"
    UPDATED = "UPDATED"

SACRAMENTO_SUPERVISOR_EMAIL = 'Brian@tlmsupply.com'
