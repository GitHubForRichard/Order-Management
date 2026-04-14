"""migrate audit_log entity_id from user.id to user_leave_hours.id

Revision ID: 567851e7c07e
Revises: 548eb18333bd
Create Date: 2026-04-14 18:41:02.908711

"""
from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision = '567851e7c07e'
down_revision = '548eb18333bd'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()

    audit_log = sa.table(
        "audit_log",
        sa.column("id", sa.UUID),
        sa.column("entity"),
        sa.column("entity_id", sa.UUID),
    )

    user_leave_hours = sa.table(
        "user_leave_hours",
        sa.column("id", sa.UUID),
        sa.column("user_id", sa.UUID),
    )

    # Build mapping between user_id and user_leave_hours.id
    ulh_rows = bind.execute(
        sa.select(
            user_leave_hours.c.user_id,
            user_leave_hours.c.id
        )
    ).fetchall()

    user_to_ulh = {row.user_id: row.id for row in ulh_rows}

    logs = bind.execute(
        sa.select(
            audit_log.c.id,
            audit_log.c.entity_id
        ).where(
            audit_log.c.entity == "user_leave_hours"
        )
    ).fetchall()

    updated = 0

    for log_id, entity_id in logs:
        # Skip if the value is already user leave hours ID
        if entity_id in user_to_ulh.values():
            continue

        # Update the value from user ID to user leave hours ID
        if entity_id in user_to_ulh:
            new_id = user_to_ulh[entity_id]

            bind.execute(
                audit_log.update()
                .where(audit_log.c.id == log_id)
                .values(entity_id=new_id)
            )
            updated += 1

    print(f"[flask db upgrade] Updated {updated} audit_log rows")


def downgrade():
    pass

    # ### end Alembic commands ###
