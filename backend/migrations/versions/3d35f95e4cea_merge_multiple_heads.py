"""Merge multiple heads

Revision ID: 3d35f95e4cea
Revises: cb2ba67de74c, e79c64da420a
Create Date: 2025-12-30 21:23:38.134225

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3d35f95e4cea'
down_revision = ('cb2ba67de74c', 'e79c64da420a')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
