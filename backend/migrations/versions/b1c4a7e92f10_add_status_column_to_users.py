"""add status column to users

Revision ID: b1c4a7e92f10
Revises: 567851e7c07e
Create Date: 2026-09-16 09:12:33.104871

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b1c4a7e92f10'
down_revision = '567851e7c07e'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column(
            'status',
            sa.String(length=50),
            nullable=False,
            server_default='ACTIVE',
        ))


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('status')
