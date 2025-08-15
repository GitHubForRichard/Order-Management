import requests
import uuid

from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from requests.auth import HTTPBasicAuth


from constants import DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER
from config import S3_BUCKET, SHIP_STATION_API_KEY, SHIP_STATION_API_SECRET
from models import Customer, db, Case, File
from s3_client import get_presigned_url, upload_file_to_s3

app = Flask(__name__)
CORS(app)

# or your DB
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

db.init_app(app)
migrate = Migrate(app, db)


@app.route('/api/cases', methods=['GET'])
def get_cases():
    """Get all cases"""
    cases = db.session.query(Case, Customer).join(
        Customer, Case.customer_id == Customer.id).all()
    result = []
    for case, customer in cases:
        case_dict = case.to_dict()
        case_dict['customer'] = customer.to_dict()
        result.append(case_dict)
    return jsonify(result)


@app.route('/api/cases', methods=['POST'])
def create_case():
    """Create a new case"""
    data = request.get_json()

    try:
        # Create a new Case instance
        new_case = Case(
            id=str(uuid.uuid4()),
            customer_id=data['customer_id'],
            model_number=data['model_number'],
            issues=data.get('issues'),
            case_number=f"TML{int(datetime.now().timestamp())}",
            sales_order=data.get('sales_order'),
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
        db.session.add(new_case)
        db.session.commit()

        return jsonify({'case': new_case.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/cases/<case_id>', methods=['PUT'])
def update_case(case_id):
    """Update an existing case"""
    case = Case.query.get(case_id)
    if not case:
        return jsonify({'error': 'Case not found'}), 404

    data = request.get_json()
    for field, value in data.items():
        if hasattr(case, field):
            setattr(case, field, value)

    setattr(case, 'updated_at', datetime.now(timezone.utc))

    try:
        db.session.commit()
        return jsonify({'case': case.to_dict()}), 200
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
        return jsonify({'error': f'Failed to update customer with id {customer_id}: {str(e)}'}), 500


@app.route('/api/shipstation/<tracking_number>', methods=['GET'])
def get_shipstation_info(tracking_number):
    response = requests.get(f'https://ssapi.shipstation.com/shipments?trackingNumber={tracking_number}', auth=HTTPBasicAuth(
        SHIP_STATION_API_KEY, SHIP_STATION_API_SECRET))

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': f'Failed to retrieve tracking information for tracking number {tracking_number}: {response.text}'}), 500


@app.route("/api/files/<case_id>", methods=["POST"])
def upload_file(case_id):
    if "file" not in request.files:
        return jsonify({"error": "No file part found"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file found"}), 400

    case = Case.query.get(case_id)
    if not case:
        return jsonify({"error": f"No case found with the provided case_id {case_id}"}), 404

    try:
        file_name = upload_file_to_s3(file)

        # Save metadata in DB
        new_file = File(
            case_id=case_id,
            name=file.filename,
            bucket_name=S3_BUCKET,
            s3_key=file_name,
            created_at=datetime.now(timezone.utc),
        )

        db.session.add(new_file)
        db.session.commit()

        return jsonify({"message": "File uploaded", "id": str(new_file.id)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/files/<case_id>', methods=['GET'])
def get_file(case_id):
    files = File.query.filter_by(case_id=case_id).all()
    if not files:
        return jsonify({"error": f"No files found for the provided case_id {case_id}"}), 404

    return jsonify({"urls": [get_presigned_url(file.to_dict()["s3_key"]) for file in files]}), 200


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Case Management API is running'})


if __name__ == '__main__':
    app.run(debug=True, port=5001)
