from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.database.base import Base

class Instruction(Base):
    __tablename__ = "instructions"
    id = Column(Integer, primary_key=True, index=True)
    version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    version = relationship("ExperimentVersion", back_populates="instructions")
    images = relationship("InstructionImage", back_populates="instruction", cascade="all, delete-orphan")

class InstructionImage(Base):
    __tablename__ = "instruction_images"
    id = Column(Integer, primary_key=True, index=True)
    instruction_id = Column(Integer, ForeignKey("instructions.id", ondelete="CASCADE"))
    image_url = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    instruction = relationship("Instruction", back_populates="images")

class ReadingText(Base):
    __tablename__ = "reading_texts"
    id = Column(Integer, primary_key=True, index=True)
    condition_id = Column(Integer, ForeignKey("conditions.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    
    condition = relationship("Condition", back_populates="reading_texts")
    paragraphs = relationship("Paragraph", back_populates="reading_text", cascade="all, delete-orphan")
    quiz_questions = relationship("QuizQuestion", back_populates="reading_text", cascade="all, delete-orphan")

class Paragraph(Base):
    __tablename__ = "paragraphs"
    id = Column(Integer, primary_key=True, index=True)
    text_id = Column(Integer, ForeignKey("reading_texts.id", ondelete="CASCADE"))
    content = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    image_caption = Column(String, nullable=True)
    sequence_index = Column(Integer, nullable=False)
    is_intervention_trigger = Column(Boolean, default=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    reading_text = relationship("ReadingText", back_populates="paragraphs")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    id = Column(Integer, primary_key=True, index=True)
    text_id = Column(Integer, ForeignKey("reading_texts.id", ondelete="CASCADE"))
    question_text = Column(String, nullable=False)
    question_type = Column(String, nullable=False) # 'mcq', 'likert', 'open_ended', 'evaluation'
    order_index = Column(Integer, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    reading_text = relationship("ReadingText", back_populates="quiz_questions")
    options = relationship("QuizOption", back_populates="question", cascade="all, delete-orphan")

class QuizOption(Base):
    __tablename__ = "quiz_options"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.id", ondelete="CASCADE"))
    option_text = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False)
    order_index = Column(Integer, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    question = relationship("QuizQuestion", back_populates="options")