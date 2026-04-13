from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    current_streak = Column(Integer, default=0)
    max_streak = Column(Integer, default=0)
    last_completed_day = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DayPlan(Base):
    __tablename__ = "day_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    day_number = Column(Integer, unique=True, nullable=False)
    title = Column(String, nullable=False)
    week = Column(Integer, nullable=False)
    dsa_task = Column(Text, nullable=False)
    ml_task = Column(Text, nullable=False)
    dev_task = Column(Text, nullable=False)
    deploy_task = Column(Text, nullable=False)

class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    day_number = Column(Integer, ForeignKey("day_plans.day_number"), nullable=False)
    
    dsa_completed = Column(Boolean, default=False)
    ml_completed = Column(Boolean, default=False)
    dev_completed = Column(Boolean, default=False)
    deploy_completed = Column(Boolean, default=False)
    
    is_day_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
