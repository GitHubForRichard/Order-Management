import os

from enum import Enum

DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "supersecure")
DB_HOST = os.getenv("POSTGRES_HOST", "postgres")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "postgres")

SECONDS_PER_MINUTE = 60
MINUTES_PER_HOUR = 60


class AuditLogActions(str, Enum):
    CREATED = "CREATED"
    UPDATED = "UPDATED"
