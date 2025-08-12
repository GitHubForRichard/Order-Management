from models import Customer, db, Order
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime, timezone

import uuid
import json

from constants import DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER

app = Flask(__name__)
CORS(app)

# or your DB
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

db.init_app(app)
migrate = Migrate(app, db)


@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders"""
    orders = db.session.query(Order, Customer).join(
        Customer, Order.customer_id == Customer.id).all()
    result = []
    for order, customer in orders:
        order_dict = order.to_dict()
        order_dict['customer'] = customer.to_dict()
        result.append(order_dict)
    return jsonify(result)


@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new order"""
    data = request.get_json()

    try:
        # Create a new Order instance
        new_order = Order(
            id=str(uuid.uuid4()),
            customer_id=data['customer_id'],
            model_number=data['model_number'],
            issues=data.get('issues'),
            case_number=f"CASE-{int(datetime.now().timestamp() * 1000)}",
            sales_order=data.get('sales_order'),
            date=datetime.strptime(
                data.get('date'), '%Y-%m-%d') if data.get('date') else None,
            assign=data.get('assign'),
            status=data.get('status', 'Pending'),
            serial=data.get('serial'),
            solution=data.get('solution'),
            action=data.get('action'),
            tracking=data.get('tracking'),
            return_status=data.get('return_status'),
            created_at=datetime.now(timezone.utc)
        )

        # Add to session and commit
        db.session.add(new_order)
        db.session.commit()

        return jsonify({'order': new_order.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    """Get a specific order by ID"""
    order = next((o for o in orders if o['id'] == order_id), None)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    # Save to file
    with open(DATA_FILE, 'w') as f:
        json.dump(orders, f, indent=2)

    return jsonify({'order': order})


@app.route('/api/orders/<order_id>', methods=['PUT'])
def update_order(order_id):
    """Update an existing order"""
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.get_json()
    for field, value in data.items():
        if hasattr(order, field):
            setattr(order, field, value)

    setattr(order, 'updated_at', datetime.now(timezone.utc))

    try:
        db.session.commit()
        return jsonify({'order': order.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Get all customers"""
    customers = Customer.query.all()
    return jsonify([customer.to_dict() for customer in customers])


@app.route('/api/customers', methods=['POST'])
def create_customer():
    """Create a new customer"""
    data = request.get_json()

    try:
        # Create a new Customer instance
        new_customer = Customer(
            id=str(uuid.uuid4()),
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone_code=data.get('phone_code'),
            phone_number=data['phone_number'],
            street=data.get('street'),
            city=data.get('city'),
            zip_code=data.get('zip_code'),
            state=data.get('state'),
            country=data.get('country'),
            created_at=datetime.now(timezone.utc)
        )

        # Add to session and commit
        db.session.add(new_customer)
        db.session.commit()

        return jsonify({'customer': new_customer.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/customers/<customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """Update an existing customer"""
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    data = request.get_json()
    for field, value in data.items():
        if hasattr(customer, field):
            setattr(customer, field, value)

    setattr(customer, 'updated_at', datetime.now(timezone.utc))

    try:
        db.session.commit()
        return jsonify({'customer': customer.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Order Management API is running'})


if __name__ == '__main__':
    app.run(debug=True, port=5001)
