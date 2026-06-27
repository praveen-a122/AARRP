from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON, DateTime, func, Text
from sqlalchemy.orm import relationship
from app.database.base import Base

class AdministratorRole(Base):
    __tablename__ = "administrator_roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    permissions = Column(JSON, nullable=False)
    administrators = relationship("Administrator", back_populates="role")

class Administrator(Base):
    __tablename__ = "administrators"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey("administrator_roles.id", ondelete="RESTRICT"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    role = relationship("AdministratorRole", back_populates="administrators")
    sessions = relationship("AdministratorSession", back_populates="admin", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="admin")
    research_notes = relationship("ResearchNote", back_populates="admin")

class AdministratorSession(Base):
    __tablename__ = "administrator_sessions"
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("administrators.id", ondelete="CASCADE"))
    token_hash = Column(String, unique=True, index=True, nullable=False)
    ip_address = Column(String, nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    admin = relationship("Administrator", back_populates="sessions")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("administrators.id", ondelete="SET NULL"), nullable=True)
    action = Column(String, nullable=False)
    target_table = Column(String, nullable=False)
    target_id = Column(Integer, nullable=False)
    old_values = Column(JSON, nullable=True)
    new_values = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    admin = relationship("Administrator", back_populates="audit_logs")

class ResearchNote(Base):
    __tablename__ = "research_notes"
    id = Column(Integer, primary_key=True, index=True)
    administrator_id = Column(Integer, ForeignKey("administrators.id", ondelete="SET NULL"), nullable=True)
    experiment_version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="CASCADE"), index=True)
    note = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    admin = relationship("Administrator", back_populates="research_notes")