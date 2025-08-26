import re
import uuid

from datetime import datetime, timezone
from models import db, AuditLog


def to_snake_case(text: str) -> str:
    # Replace spaces or hyphens with underscores
    text = re.sub(r'[\s\-]+', '_', text)

    # Insert underscore before any uppercase letter (not at start)
    text = re.sub(r'(?<!^)(?=[A-Z])', '_', text)

    # Lowercase everything
    text = text.lower()

    # Remove any duplicate underscores
    text = re.sub(r'_+', '_', text)

    # Strip leading/trailing underscores
    return text.strip('_')


def update_fields(model_instance, updated_data, action, user_id, entity_name=None, immutable_fields=None):
    """
    Create AuditLog entries for changed fields on a SQLAlchemy model.

    :param model_instance: The SQLAlchemy model instance being updated
    :param action: The action performed on this log
    :param updated_data: Dict of updated values (e.g. request.get_json())
    :param user_id: UUID of the user performing the update
    :param entity_name: Optional string name of the entity/table. Defaults to model_instance.__tablename__
    :param immutable_fields: Optional set of fields to ignore (like id, created_at)
    """
    if entity_name is None:
        entity_name = getattr(model_instance, "__tablename__",
                              model_instance.__class__.__name__)

    audit_logs = []

    for field, new_value in updated_data.items():
        if hasattr(model_instance, field) and field not in immutable_fields:
            old_value = getattr(model_instance, field)
            if str(old_value) != str(new_value):
                setattr(model_instance, field, new_value)
                audit_logs.append(AuditLog(
                    id=uuid.uuid4(),
                    action=action,
                    entity=entity_name,
                    entity_id=model_instance.id,
                    field=field,
                    old_value=str(
                        old_value) if old_value is not None else None,
                    new_value=str(
                        new_value) if new_value is not None else None,
                    created_by=user_id,
                    created_at=datetime.now(timezone.utc)
                ))

    if audit_logs:
        db.session.add_all(audit_logs)
