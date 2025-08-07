from models import db, Order
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime

import uuid
import json
import os

app = Flask(__name__)
CORS(app)

# or your DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:supersecure@localhost:5432/postgres'

db.init_app(app)
migrate = Migrate(app, db)


@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders"""
    orders = Order.query.all()
    print('orders', orders)
    return jsonify([order.to_dict() for order in orders])


@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new order"""
    data = request.get_json()

    # Validate required fields
    required_fields = ['first_name', 'last_name',
                       'phone_number', 'model_number', 'email']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    # Create new order
    new_order = {
        'id': str(uuid.uuid4()),
        'first_name': data['first_name'],
        'last_name': data['last_name'],
        'phone_number': data['phone_number'],
        'model_number': data['model_number'],
        'issues': data.get('issues', ''),
        'case': data.get('case', ''),
        'email': data['email'],
        'sales_order': data.get('sales_order', ''),
        'date': data.get('date', datetime.utcnow().strftime('%Y-%m-%d')),
        'address': data.get('address', ''),
        'street': data.get('street', ''),
        'city': data.get('city', ''),
        'zip_code': data.get('zip_code', ''),
        'state': data.get('state', ''),
        'country': data.get('country', ''),
        'assign': data.get('assign', ''),
        'status': data.get('status', 'Pending'),
        'serial': data.get('serial', ''),
        'solution': data.get('solution', ''),
        'action': data.get('action', ''),
        'file_name': data.get('file_name', ''),
        'tracking': data.get('tracking', ''),
        'return_status': data.get('return_status', ''),
        'created_at': datetime.utcnow().isoformat() + 'Z'
    }

    orders.append(new_order)
    # Save to file
    with open(DATA_FILE, 'w') as f:
        json.dump(orders, f, indent=2)

    return jsonify({'order': new_order}), 201


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
    order = next((o for o in orders if o['id'] == order_id), None)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.get_json()

    # Update fields
    updatable_fields = ['customer_name', 'phone_number', 'model_number', 'issues', 'case', 'email', 'sales_order', 'date', 'address', 'street',
                        'city', 'zip_code', 'state', 'country', 'assign', 'status', 'serial', 'solution', 'action', 'file_name', 'tracking', 'return_status']
    for field in updatable_fields:
        if field in data:
            order[field] = data[field]

    return jsonify({'order': order})


@app.route('/api/orders/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    """Delete an order"""
    global orders
    order = next((o for o in orders if o['id'] == order_id), None)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    orders = [o for o in orders if o['id'] != order_id]
    # Save to file
    with open(DATA_FILE, 'w') as f:
        json.dump(orders, f, indent=2)

    return jsonify({'message': 'Order deleted successfully'})


@app.route('/api/orders/status/<status>', methods=['GET'])
def get_orders_by_status(status):
    """Get orders by status"""
    filtered_orders = [
        o for o in orders if o['status'].lower() == status.lower()]
    return jsonify({'orders': filtered_orders})


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Order Management API is running'})


if __name__ == '__main__':
    app.run(debug=True, port=5001)
