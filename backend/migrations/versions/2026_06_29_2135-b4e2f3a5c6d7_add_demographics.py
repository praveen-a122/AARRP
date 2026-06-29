"""add demographics column to participants

Revision ID: b4e2f3a5c6d7
Revises: a3f1c2d4e5b6
Create Date: 2026-06-29 21:35:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b4e2f3a5c6d7'
down_revision: Union[str, None] = 'a3f1c2d4e5b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('participants', sa.Column('demographics', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('participants', 'demographics')
