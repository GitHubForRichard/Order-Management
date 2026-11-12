import jwt
import uuid
from datetime import datetime, timedelta, timezone
from flask import request, jsonify
from functools import wraps

from config import JWT_SECRET_KEY
from constants import UserStatus
from models import User

RESET_TOKEN_TTL_MINUTES = 30


def generate_jwt(user_id: str, expires_in: int = 3600 * 24):
    """Generate JWT token for a user"""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "exp": now + timedelta(seconds=expires_in),
        "iat": now
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")
    return token


def verify_jwt(token: str):
    """Verify JWT token and return user_id"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401

        token = auth_header.split(" ")[1]
        user_id = verify_jwt(token)
        if not user_id:
            return jsonify({"error": "Invalid or expired token"}), 401

        request.user = User.query.get(user_id)
        if not request.user or request.user.status != UserStatus.ACTIVE:
            return jsonify({"error": "Account is inactive"}), 401

        return f(*args, **kwargs)
    return decorated_function


def _reset_signing_key(user: User) -> str:
    return JWT_SECRET_KEY + user.password_hash


def generate_reset_token(user: User) -> str:
    """Generate a password reset token that stops working once the password changes"""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.id),
        "exp": now + timedelta(minutes=RESET_TOKEN_TTL_MINUTES),
        "iat": now
    }
    return jwt.encode(payload, _reset_signing_key(user), algorithm="HS256")


def user_from_reset_token(token: str):
    """Return the user a valid reset token belongs to, or None"""
    try:
        unverified = jwt.decode(token, options={"verify_signature": False})
        user = User.query.get(uuid.UUID(str(unverified.get("sub"))))
        if user:
            jwt.decode(token, _reset_signing_key(user), algorithms=["HS256"])
        return user
    except (jwt.InvalidTokenError, ValueError):
        return None
