from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Case(db.Model):
    __tablename__ = 'cases'

    id = db.Column(db.String(36), primary_key=True)  # UUID string
    customer_id = db.Column(db.String(36), db.ForeignKey(
        'customers.id'), nullable=False)
    issues = db.Column(db.Text, nullable=True)
    model_number = db.Column(db.String(50), nullable=False)
    case_number = db.Column(db.String(50), nullable=True)
    sales_order = db.Column(db.String(50), nullable=True)
    assign = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(50), nullable=True)
    serial = db.Column(db.String(100), nullable=True)
    solution = db.Column(db.Text, nullable=True)
    action = db.Column(db.Text, nullable=True)
    tracking = db.Column(db.String(100), nullable=True)
    return_status = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Case {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'model_number': self.model_number,
            'issues': self.issues,
            'case_number': self.case_number,
            'sales_order': self.sales_order,
            'assign': self.assign,
            'status': self.status,
            'serial': self.serial,
            'solution': self.solution,
            'action': self.action,
            'tracking': self.tracking,
            'return_status': self.return_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.String(36), primary_key=True)  # UUID string
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone_code = db.Column(db.String(10), nullable=True)
    phone_number = db.Column(db.String(20), nullable=False)
    street = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    zip_code = db.Column(db.String(20), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime(), nullable=False,
                           default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(), nullable=True)

    def __repr__(self):
        return f'<Customer {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone_code': self.phone_code,
            'phone_number': self.phone_number,
            'street': self.street,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'country': self.country,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
