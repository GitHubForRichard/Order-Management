import boto3
import re
from datetime import datetime

from config import (
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    LOCALSTACK_HOST,
    S3_BUCKET
)
from constants import SECONDS_PER_MINUTE, MINUTES_PER_HOUR

# Create S3 client pointing to LocalStack
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
    endpoint_url=f"http://{LOCALSTACK_HOST}:4566",
)


def sanitize_file_name(file_name: str) -> str:
    # Replace spaces with underscores and remove weird chars
    safe_name = re.sub(r'[^A-Za-z0-9._-]', '_', file_name)
    return safe_name


def ensure_bucket_exists():
    """Create bucket if it doesn't exist."""
    buckets = [b["Name"] for b in s3_client.list_buckets().get("Buckets", [])]
    if S3_BUCKET not in buckets:
        s3_client.create_bucket(Bucket=S3_BUCKET)


def upload_file_to_s3(file_obj):
    """Upload file object to S3 and return file URL."""
    file_name = f"{file_obj.filename}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    file_name = sanitize_file_name(file_name)
    print('file_name', file_name)
    ensure_bucket_exists()
    s3_client.upload_fileobj(file_obj, S3_BUCKET, file_name)

    return file_name


def get_presigned_url(file_key):
    # Generate a presigned URL valid for 1 hour
    url = s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": S3_BUCKET, "Key": file_key},
        ExpiresIn=MINUTES_PER_HOUR * SECONDS_PER_MINUTE
    )

    # Replace localstack host to localhost, so the host can access
    url = url.replace('localstack', 'localhost', 1)
    return url
