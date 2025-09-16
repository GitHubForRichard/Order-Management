import uuid
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base


db = SQLAlchemy()  # initialize globally


class Customer(db.Model):
    __tablename__ = 'customers'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone_code = Column(String(10), nullable=True)
    phone_number = Column(String(20), nullable=False)
    street = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    zip_code = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey(
        'users.id'), nullable=False)
    created_at = Column(DateTime, nullable=False,
                        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f'<Customer {self.id}>'

    def to_dict(self):
        return {
            'id': str(self.id),
            'first_name': self.first_name,
            'middle_name': self.middle_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone_code': self.phone_code,
            'phone_number': self.phone_number,
            'street': self.street,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'country': self.country,
            'created_by': str(self.created_by) if self.created_by else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Case(db.Model):
    __tablename__ = 'cases'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey(
        'customers.id'), nullable=False)
    model_number = Column(String(50), nullable=False)
    issues = Column(Text, nullable=True)
    case_number = Column(String(50), nullable=True)
    sales_order = Column(String(50), nullable=True)
    purchase_order = Column(String(50), nullable=True)
    market_place = Column(String(50), nullable=True)
    assign = Column(String(100), nullable=True)
    status = Column(String(50), nullable=True)
    serial = Column(String(100), nullable=True)
    solution = Column(Text, nullable=True)
    action = Column(Text, nullable=True)
    tracking = Column(String(100), nullable=True)
    return_status = Column(String(50), nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey(
        'users.id'), nullable=False)
    created_at = Column(DateTime, nullable=False,
                        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f'<Case {self.id}>'

    def to_dict(self):
        return {
            'id': str(self.id),
            'customer_id': str(self.customer_id),
            'model_number': self.model_number,
            'issues': self.issues,
            'case_number': self.case_number,
            'sales_order': self.sales_order,
            'purchase_order': self.purchase_order,
            'market_place': self.market_place,
            'assign': self.assign,
            'status': self.status,
            'serial': self.serial,
            'solution': self.solution,
            'action': self.action,
            'tracking': self.tracking,
            'return_status': self.return_status,
            'created_by': str(self.created_by) if self.created_by else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class File(db.Model):
    __tablename__ = "files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey(
        'cases.id'), nullable=False)
    name = Column(String, nullable=False)
    drive_file_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(
        timezone.utc), nullable=False)
    deleted_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f'<File {self.id}>'

    def to_dict(self):
        return {
            'id': str(self.id),
            'case_id': str(self.case_id),
            'name': self.name,
            'drive_file_id': self.drive_file_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'deleted_at': self.deleted_at.isoformat() if self.deleted_at else None
        }


class User(db.Model):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(
        timezone.utc), nullable=False)

    def __repr__(self):
        return f'<User {self.id}>'

    def to_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'password_hash': self.password_hash,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class AuditLog(db.Model):
    __tablename__ = "audit_log"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    action = db.Column(db.String(50), nullable=False)
    entity = db.Column(db.String(255), nullable=False)
    entity_id = db.Column(UUID(as_uuid=True), nullable=False)
    field = db.Column(db.String(255), nullable=False)
    old_value = db.Column(db.Text, nullable=True)
    new_value = db.Column(db.Text, nullable=True)
    created_by = db.Column(UUID(as_uuid=True), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(
        timezone.utc), nullable=False)

    def __repr__(self):
        return f'<AuditLog {self.id}>'

    def to_dict(self):
        return {
            'id': str(self.id),
            'action': self.action,
            'entity': self.entity,
            'entity_id': str(self.entity_id),
            'field': self.field,
            'old_value': self.old_value,
            'new_value': self.new_value,
            'created_by': str(self.created_by) if self.created_by else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
