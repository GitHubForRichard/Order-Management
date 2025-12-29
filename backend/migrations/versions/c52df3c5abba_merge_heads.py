"""Merge heads

Revision ID: c52df3c5abba
Revises: 5692aeaa25b7, ba92e4d880eb, cb2ba67de74c, e79c64da420a
Create Date: 2025-12-29 18:50:22.687666

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c52df3c5abba'
down_revision = ('5692aeaa25b7', 'ba92e4d880eb', 'cb2ba67de74c', 'e79c64da420a')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
