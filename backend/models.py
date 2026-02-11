from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    messages = relationship("Message", back_populates="owner")
    emotion_logs = relationship("EmotionLog", back_populates="owner")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String)  # "user" or "bot"
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Analysis Fields (only for user messages generally)
    detected_emotion = Column(String, nullable=True)
    emotion_confidence = Column(Float, nullable=True)
    is_crisis = Column(Integer, default=0) # 0 or 1 (boolean)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Making nullable for backward compatibility with existing data
    owner = relationship("User", back_populates="messages")

class EmotionLog(Base):
    __tablename__ = "emotion_logs"
    id = Column(Integer, primary_key=True, index=True)
    emotion = Column(String)
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", back_populates="emotion_logs")
