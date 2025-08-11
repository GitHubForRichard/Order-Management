from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Order(db.Model):
    __tablename__ = 'orders'  # Or 'orders' (recommended)

    id = db.Column(db.String(36), primary_key=True)  # UUID string
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    model_number = db.Column(db.String(50), nullable=False)
    issues = db.Column(db.Text, nullable=True)
    case = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(100), nullable=False)
    sales_order = db.Column(db.String(50), nullable=True)
    date = db.Column(db.Date, nullable=True)
    address = db.Column(db.String(200), nullable=True)
    street = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    zip_code = db.Column(db.String(20), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
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
        return f'<Order {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone_number': self.phone_number,
            'model_number': self.model_number,
            'issues': self.issues,
            'case': self.case,
            'email': self.email,
            'sales_order': self.sales_order,
            'date': self.date.isoformat() if self.date else None,
            'address': self.address,
            'street': self.street,
            'city': self.city,
            'zip_code': self.zip_code,
            'state': self.state,
            'country': self.country,
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
