from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User Schemas
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    xp: int
    level: int
    current_streak: int
    max_streak: int
    last_completed_day: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Day Plan Schemas
class DayPlanResponse(BaseModel):
    id: int
    day_number: int
    title: str
    week: int
    dsa_task: str
    ml_task: str
    dev_task: str
    deploy_task: str

    class Config:
        from_attributes = True

# Progress Schemas
class UserProgressUpdate(BaseModel):
    dsa_completed: bool
    ml_completed: bool
    dev_completed: bool
    deploy_completed: bool

class UserProgressResponse(BaseModel):
    id: int
    user_id: int
    day_number: int
    dsa_completed: bool
    ml_completed: bool
    dev_completed: bool
    deploy_completed: bool
    is_day_completed: bool
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True

class DayWithProgressResponse(BaseModel):
    day_plan: DayPlanResponse
    progress: Optional[UserProgressResponse]
