import requests
import pandas as pd
import uuid

from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_apscheduler import APScheduler
from flask_cors import CORS
from flask_migrate import Migrate
from requests.auth import HTTPBasicAuth
from sqlalchemy import desc
from werkzeug.security import generate_password_hash, check_password_hash

from auth import generate_jwt, jwt_required
from constants import AuditLogActions, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER
from config import (
    MAIL_PASSWORD,
    MAIL_PORT,
    MAIL_SERVER,
    MAIL_USE_TLS,
    MAIL_USERNAME,
    ORDER_HISTORY_CSV_FILE_PATH,
    PRODUCT_CSV_FILE_PATH,
    SHIP_STATION_API_KEY,
    SHIP_STATION_API_SECRET
)
from cron_jobs.grant_monthly_pto import grant_monthly_pto
from emailer import init_mail, send_email
from utils import get_case_assignees, update_fields, to_snake_case
from models import AuditLog, Customer, Leave, UserLeaveHours, db, Case, File, User
from google_drive_client import upload_file_to_google_drive, get_web_view_link

class Config:
    SCHEDULER_API_ENABLED = True

app = Flask(__name__)
CORS(app)

# DB config
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Email config
app.config['MAIL_SERVER'] = MAIL_SERVER
app.config['MAIL_PORT'] = MAIL_PORT
app.config['MAIL_USE_TLS'] = MAIL_USE_TLS
app.config['MAIL_USERNAME'] = MAIL_USERNAME
app.config['MAIL_PASSWORD'] = MAIL_PASSWORD

init_mail(app)

db.init_app(app)
migrate = Migrate(app, db)

app.config.from_object(Config)
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

scheduler.add_job(
    id="grant_monthly_pto",
    func=lambda: grant_monthly_pto(app),
    trigger="cron",
    hour=0,
    minute=0
)


@app.route('/api/cases', methods=['GET'])
@jwt_required
def get_cases():
    """Get all cases"""
    cases = (
        db.session.query(Case, Customer, User)
        .join(Customer, Case.customer_id == Customer.id)
        .join(User, Case.created_by == User.id)
        .all()
    )
    result = []
    for case, customer, user in cases:
        case_dict = case.to_dict()
        case_dict['customer'] = customer.to_dict()
        case_dict['created_by'] = user.to_dict()
        result.append(case_dict)
    return jsonify(result)


@app.route('/api/cases', methods=['POST'])
@jwt_required
def create_case():
    """Create a new case"""
    data = request.get_json()
    user = request.user

    try:
        assignee = data.get('assign')
        # Create a new Case instance
        new_case = Case(
            id=str(uuid.uuid4()),
            customer_id=data['customer_id'],
            model_number=data['model_number'],
            issues=data.get('issues'),
            case_number=f"TLM{int(datetime.now().timestamp())}",
            sales_order=data.get('sales_order'),
            purchase_order=data.get('purchase_order'),
            market_place=data.get('market_place'),
            assign=assignee,
            status=data.get('status', 'Pending'),
            serial=data.get('serial'),
            solution=data.get('solution'),
            action=data.get('action'),
            tracking=data.get('tracking'),
            return_status=data.get('return_status'),
            return_for_service=data.get('return_for_service', False),
            created_by=user.id,
            created_at=datetime.now(timezone.utc)
        )

        # Add to session and commit
        db.session.add(new_case)
        db.session.commit()

        case_number = new_case.case_number

        # Send email to assignee when a new case is created
        if assignee:
            body = f'Hi, \n\nThis is a notification that the case {case_number} has been assigned to you.'
            send_email(
                subject=f"Case Assigned: {case_number}",
                recipients=[assignee],
                body=body,
                sender=app.config['MAIL_USERNAME']
            )
        return jsonify({'case': new_case.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/cases/<case_id>', methods=['PUT'])
@jwt_required
def update_case(case_id):
    """Update an existing case"""
    case = Case.query.get(case_id)
    if not case:
        return jsonify({'error': 'Case not found'}), 404

    prev_assignee = case.to_dict().get('assign')

    immutable_fields = {"id", "created_by", "created_at", "updated_at"}

    data = request.get_json()
    new_assignee = data.get('assign')

    update_fields(case, data, AuditLogActions.UPDATED, request.user.id,
                  immutable_fields=immutable_fields)

    setattr(case, 'updated_at', datetime.now(timezone.utc))

    try:
        db.session.commit()
        if new_assignee is not None:
            # Send email when new assignee is assigned
            if new_assignee != prev_assignee:
                body = f'Hi, \n\nThis is a notification that the case {case.case_number} has been assigned to you.'
                send_email(
                    subject=f"Case Assigned: {case.case_number}",
                    recipients=[new_assignee],
                    body=body,
                    sender=app.config['MAIL_USERNAME']
                )
            # Send email to the assignee when there is an update
            else:
                body = f'Hi, \n\nThis is a notification that the case {case.case_number} has been updated.'
                send_email(
                    subject=f"Case Updated: {case.case_number}",
                    recipients=[new_assignee],
                    body=body,
                    sender=app.config['MAIL_USERNAME']
                )

        return jsonify({'case': case.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/cases/history/<case_id>', methods=['GET'])
@jwt_required
def get_case_history(case_id):
    """Get audit log for the given case ID"""
    audit_logs = (
        db.session.query(AuditLog, Case, User)
        .filter(AuditLog.entity == "cases")
        .filter(AuditLog.entity_id == case_id)
        .join(Case, AuditLog.entity_id == Case.id)
        .join(User, Case.created_by == User.id)
        .order_by(desc(AuditLog.created_at))
        .all()
    )
    result = []
    for audit_log, case, user in audit_logs:
        audit_log_dict = audit_log.to_dict()
        audit_log_dict['case'] = case.to_dict()
        audit_log_dict['created_by'] = user.to_dict()
        result.append(audit_log_dict)

    return jsonify(result)


@app.route('/api/customers', methods=['GET'])
@jwt_required
def get_customers():
    """Get all customers"""
    customers = (
        db.session.query(Customer, User)
        .join(User, Customer.created_by == User.id)
        .all()
    )

    result = []
    for customer, user in customers:
        customer_dict = customer.to_dict()
        customer_dict['created_by'] = user.to_dict()
        result.append(customer_dict)

    return jsonify(result)


@app.route('/api/customers', methods=['POST'])
@jwt_required
def create_customer():
    """Create a new customer"""
    data = request.get_json()
    user = request.user

    try:
        # Create a new Customer instance
        new_customer = Customer(
            id=str(uuid.uuid4()),
            first_name=data['first_name'],
            middle_name=data['middle_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone_code=data.get('phone_code'),
            phone_number=data['phone_number'],
            street=data.get('street'),
            city=data.get('city'),
            zip_code=data.get('zip_code'),
            state=data.get('state'),
            country=data.get('country'),
            created_by=user.id,
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
@jwt_required
def update_customer(customer_id):
    """Update an existing customer"""
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    data = request.get_json()

    immutable_fields = {"id", "created_by", "created_at"}

    for field, value in data.items():
        if hasattr(customer, field) and field not in immutable_fields:
            setattr(customer, field, value)

    setattr(customer, 'updated_at', datetime.now(timezone.utc))

    try:
        db.session.commit()
        return jsonify({'customer': customer.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update customer with id {customer_id}: {str(e)}'}), 500


@app.route('/api/shipstation/<tracking_number>', methods=['GET'])
@jwt_required
def get_shipstation_info(tracking_number):
    response = requests.get(f'https://ssapi.shipstation.com/shipments?trackingNumber={tracking_number}', auth=HTTPBasicAuth(
        SHIP_STATION_API_KEY, SHIP_STATION_API_SECRET))

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': f'Failed to retrieve tracking information for tracking number {tracking_number}: {response.text}'}), 500


@app.route("/api/files/<case_id>", methods=["POST"])
@jwt_required
def upload_file(case_id):
    if "files" not in request.files:
        return jsonify({"error": "No files part found"}), 400

    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No files content found"}), 400

    case = Case.query.get(case_id)
    if not case:
        return jsonify({"error": f"No case found with the provided case_id {case_id}"}), 404

    uploaded_files_info = []

    try:
        for file in files:
            upload_response = upload_file_to_google_drive(file)

            # Save metadata in DB
            new_file = File(
                case_id=case_id,
                name=upload_response.get("file_name", None),
                drive_file_id=upload_response.get("file_id", None),
                created_at=datetime.now(timezone.utc),
            )

            db.session.add(new_file)
            db.session.commit()

            uploaded_files_info.append({
                "id": str(new_file.id),
                "name": new_file.name,
            })

        return upload_response
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/files/<case_id>", methods=["PUT"])
@jwt_required
def update_images(case_id):
    removed_ids = request.form.getlist("remove[]")
    new_files = request.files.getlist("add")

    # Remove selected files
    for id in removed_ids:
        file = db.session.get(File, id)
        if file:
            file.deleted_at = datetime.now(timezone.utc)
            db.session.add(file)

    # Add new files
    added_ids = []
    for file in new_files:
        upload_response = upload_file_to_google_drive(file)

        # Save metadata in DB
        new_file = File(
            case_id=case_id,
            name=upload_response.get("file_name", None),
            drive_file_id=upload_response.get("file_id", None),
            created_at=datetime.now(timezone.utc),
        )

        db.session.add(new_file)
        db.session.flush()
        added_ids.append(new_file.id)

    db.session.commit()

    return jsonify({
        "removed": removed_ids,
        "added": added_ids
    }), 200


@app.route('/api/files/<case_id>', methods=['GET'])
@jwt_required
def get_file(case_id):
    files = (
        File.query
        .filter_by(case_id=case_id)
        .filter(File.deleted_at.is_(None))
        .all()
    )

    file_dict = [file.to_dict() for file in files]

    for file in file_dict:
        file["url"] = get_web_view_link(file["drive_file_id"])

    return jsonify({"files": file_dict}), 200


@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    if not data.get("password") or not data.get("email") or not data.get("first_name") or not data.get("last_name"):
        return jsonify({"error": "email, password, first_name and last_name are required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(data["password"])
    user = User(email=data["email"], password_hash=hashed_password,
                first_name=data["first_name"], last_name=data["last_name"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "email and password required"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    user = user.to_dict()
    if not user or not check_password_hash(user['password_hash'], data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_jwt(str(user['id']))
    return jsonify({"token": token, "user": user})


@app.route('/api/model-numbers', methods=['GET'])
@jwt_required
def get_model_numbers():
    model_numbers = []
    if PRODUCT_CSV_FILE_PATH:
        df = pd.read_csv(PRODUCT_CSV_FILE_PATH, skiprows=4)
        model_numbers = df.iloc[:, 0].dropna().tolist()

    return jsonify({"model_numbers": model_numbers})


@app.route("/api/products", methods=["GET"])
@jwt_required
def get_products():
    records = []
    if PRODUCT_CSV_FILE_PATH:
        df = pd.read_csv(
            PRODUCT_CSV_FILE_PATH,
            skiprows=3,
            skipfooter=1,  # Skip the last row containing the report date
            engine='python'
        )
        df.columns = [to_snake_case(col) for col in df.columns]
        records = df.to_dict(orient="records")

    return jsonify({"products": records})


@app.route('/api/assignees', methods=['GET'])
@jwt_required
def get_assignees():
    assignees = get_case_assignees()
    return jsonify(assignees)


@app.route("/api/order-history", methods=["GET"])
@jwt_required
def get_order_history():
    search_term = request.args.get("search_term", "").strip()
    records = []
    if ORDER_HISTORY_CSV_FILE_PATH:
        df = pd.read_csv(ORDER_HISTORY_CSV_FILE_PATH)

        # Only keep these columns
        df = df[["SONum", "PONum", "Date", "ShipToName",
                 "ProductNumber", "ProductQuantity"]]

        if search_term:
            df = df[df["PONum"].astype(str).str.contains(search_term, case=False, na=False)]
        
        df.columns = [to_snake_case(col) for col in df.columns]
        
        records = df.to_dict(orient="records")

    return jsonify({"orders": records})


@app.route("/api/leaves", methods=["GET"])
@jwt_required
def get_leaves():
    """Get leave requests for the current user, optionally filtered by date range"""
    user_id = request.user.id
    user = User.query.get(user_id)

    # Get query parameters
    start_date_str = request.args.get("start_date")
    end_date_str = request.args.get("end_date")

    # Convert query params to datetime objects if provided
    start_date = datetime.fromisoformat(start_date_str) if start_date_str else None
    end_date = datetime.fromisoformat(end_date_str) if end_date_str else None

    # Build base query
    if user.role == "manager":
        query = Leave.query
    else:
        query = Leave.query.filter_by(created_by=user_id)

    # Apply date filters if provided
    if start_date:
        query = query.filter(Leave.start_date >= start_date)
    if end_date:
        query = query.filter(Leave.end_date <= end_date)

    leave_list = query.order_by(Leave.start_date.desc()).all()

    # Add user info and remaining hours
    result = []
    for leave in leave_list:
        leave_user = User.query.get(leave.created_by)
        user_hours = UserLeaveHours.query.filter_by(user_id=leave.created_by).first()

        leave_dict = leave.to_dict()
        leave_dict["created_by"] = {
            "id": leave.created_by,
            "first_name": leave_user.first_name,
            "last_name": leave_user.last_name,
            "remaining_hours": user_hours.remaining_hours if user_hours else 0
        }

        result.append(leave_dict)

    return jsonify(result), 200


@app.route("/api/leaves", methods=["POST"])
@jwt_required
def create_leave():
    """Create a new leave request"""
    user_id = request.user.id
    data = request.get_json()

    type = data.get("type")
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    hours = data.get("hours")

    if not start_date or not end_date or hours is None:
        return jsonify({"error": "start_date, end_date, and hours are required"}), 400

    try:
        start = datetime.fromisoformat(start_date).date()
        end = datetime.fromisoformat(end_date).date()
    except ValueError:
        return jsonify({"error": "Invalid date format, expected YYYY-MM-DD"}), 400

    if start > end:
        return jsonify({"error": "start_date cannot be later than end_date"}), 400
    
    # Validate PTO hours for Paid leaves before creating the leave
    user_leave_hours = UserLeaveHours.query.filter_by(user_id=user_id).first()
    if type == "Paid" and user_leave_hours:
        if hours > user_leave_hours.remaining_hours:
            return jsonify({"error": "Insufficient remaining PTO hours"}), 400
        else:
            user_leave_hours.remaining_hours -= hours

    new_leave = Leave(
        type=type,
        created_by=user_id,
        start_date=start,
        end_date=end,
        hours=hours,
        status="Pending"
    )

    try:
        db.session.add(new_leave)
        db.session.commit()
        return jsonify(new_leave.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/leaves/<leave_id>/action", methods=["PATCH"])
@jwt_required
def leave_action(leave_id):
    data = request.get_json()
    action = data.get("action")
    if action not in ("approve", "reject", "cancel"):
        return jsonify({"error": "Invalid action"}), 400

    leave = Leave.query.get_or_404(leave_id)

    if action == "cancel" or action == "reject":
        if leave.type == "Paid":
            # Fetch user leave remaining hours
            leave_user_id = leave.created_by
            user_leave_hours = UserLeaveHours.query.filter_by(user_id=leave_user_id).first()
            if not user_leave_hours:
                return jsonify({"error": f"User PTO record not found for User ID {leave_user_id}"}), 404
            else:
                user_leave_hours.remaining_hours += leave.hours
            if action == "cancel":
                leave.status = "Cancelled"
            elif action == "reject":
                leave.status = "Rejected"
    elif action == "approve":
        leave.status = "Approved"

    db.session.commit()
    return jsonify({"success": True, "leave": leave.to_dict()}), 200

@app.route("/api/leaves/remaining", methods=["GET"])
@jwt_required
def get_remaining_leave_hours():
    """Get the remaining PTO hours for the current user"""
    user_id = request.user.id

    # Fetch from the UserPTO table
    user_leave_hour = UserLeaveHours.query.filter_by(user_id=user_id).first()

    if not user_leave_hour:
        return jsonify({"error": f"User Leave Hour record not found for User ID {user_id}"}), 404

    return jsonify({
        "user_id": user_leave_hour.user_id,
        "remaining_hours": user_leave_hour.remaining_hours
    }), 200

@app.route('/api/leaves/history/remaining_hours/<user_id>', methods=['GET'])
@jwt_required
def get_user_remaining_hours(user_id):
    audit_logs = AuditLog.query.filter_by(entity_id=user_id, entity=UserLeaveHours.__tablename__).order_by(desc(AuditLog.created_at)).all()
    return jsonify([audit_log.to_dict() for audit_log in audit_logs]), 200


@app.route('/api/users', methods=['GET'])
@jwt_required
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])


@app.route('/api/users/<user_id>', methods=['GET'])
@jwt_required
def get_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())

@app.route('/api/users/<user_id>', methods=['PUT'])
@jwt_required
def update_user(user_id):
    """Update an existing user"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    immutable_fields = {"id", "created_at", "password_hash"}

    data = request.get_json()

    update_fields(user, data, AuditLogActions.UPDATED, request.user.id,
                  immutable_fields=immutable_fields)


    try:
        db.session.commit()

        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Case Management API is running'})

@app.route('/api/run-pto', methods=['POST'])
@jwt_required
def run_pto():
    """Endpoint to process backend PTO"""
    # Implement your PTO processing logic here
    grant_monthly_pto(app)
    return jsonify({'success': True, 'message': 'PTO processed successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)
