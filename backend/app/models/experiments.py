from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON, DateTime, func
from sqlalchemy.orm import relationship
from app.database.base import Base

class Experiment(Base):
    __tablename__ = "experiments"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True) # Soft delete

    versions = relationship("ExperimentVersion", back_populates="experiment", cascade="all, delete-orphan")

class ExperimentVersion(Base):
    __tablename__ = "experiment_versions"
    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id", ondelete="CASCADE"))
    version_number = Column(Integer, nullable=False)
    status = Column(String, nullable=False, default="draft")
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True) # Soft delete

    experiment = relationship("Experiment", back_populates="versions")
    conditions = relationship("Condition", back_populates="version", cascade="all, delete-orphan")
    prompt_templates = relationship("PromptTemplate", back_populates="version", cascade="all, delete-orphan")
    instructions = relationship("Instruction", back_populates="version", cascade="all, delete-orphan")

class Condition(Base):
    __tablename__ = "conditions"
    id = Column(Integer, primary_key=True, index=True)
    version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    is_control = Column(Boolean, default=False)
    settings = Column(JSON, nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    
    version = relationship("ExperimentVersion", back_populates="conditions")
    reading_texts = relationship("ReadingText", back_populates="condition", cascade="all, delete-orphan")

class PromptTemplate(Base):
    __tablename__ = "prompt_templates"
    id = Column(Integer, primary_key=True, index=True)
    version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    system_prompt = Column(String, nullable=False)
    user_prompt_template = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    version = relationship("ExperimentVersion", back_populates="prompt_templates")