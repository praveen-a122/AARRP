"""add telemetry_events table

Revision ID: a3f1c2d4e5b6
Revises: 709b5d97c4c7
Create Date: 2026-06-28

Additive migration — no existing tables are altered.
"""
from alembic import op
import sqlalchemy as sa

revision = 'a3f1c2d4e5b6'
down_revision = '709b5d97c4c7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'telemetry_events',
        sa.Column('id',                   sa.Integer(),     primary_key=True, index=True),
        sa.Column('event_type',           sa.String(64),    nullable=False),
        sa.Column('participant_id',       sa.String(128),   nullable=True,  index=True),
        sa.Column('session_id',           sa.String(128),   nullable=True,  index=True),
        sa.Column('section_id',           sa.String(128),   nullable=True),
        sa.Column('paragraph_id',         sa.String(128),   nullable=True,  index=True),
        sa.Column('dwell_time_s',         sa.Integer(),     nullable=True),
        sa.Column('visit_count',          sa.Integer(),     nullable=True),
        sa.Column('backtrack_count',      sa.Integer(),     nullable=True),
        sa.Column('cursor_idle_seconds',  sa.Integer(),     nullable=True),
        sa.Column('cursor_idle_episodes', sa.Integer(),     nullable=True),
        sa.Column('longest_idle_s',       sa.Integer(),     nullable=True),
        sa.Column('raw_metadata',         sa.Text(),        nullable=True),
        sa.Column('timestamp',            sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('telemetry_events')
