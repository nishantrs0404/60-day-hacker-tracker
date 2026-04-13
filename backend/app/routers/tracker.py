from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import User, DayPlan, UserProgress
from app.schemas import DayPlanResponse, UserProgressUpdate, DayWithProgressResponse, UserProgressResponse
from app.routers.auth import get_current_user
from app.utils.gamification import calculate_xp_and_level

router = APIRouter()

@router.get("/days", response_model=List[DayWithProgressResponse])
def get_all_days(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    days = db.query(DayPlan).order_by(DayPlan.day_number).all()
    progress_records = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    
    progress_dict = {p.day_number: p for p in progress_records}
    
    response = []
    for day in days:
        response.append(DayWithProgressResponse(
            day_plan=day,
            progress=progress_dict.get(day.day_number)
        ))
    return response

@router.get("/days/{day_number}", response_model=DayWithProgressResponse)
def get_day(day_number: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    day = db.query(DayPlan).filter(DayPlan.day_number == day_number).first()
    if not day:
        raise HTTPException(status_code=404, detail="Day not found")
        
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.day_number == day_number
    ).first()
    
    return DayWithProgressResponse(day_plan=day, progress=progress)

@router.post("/progress/{day_number}", response_model=UserProgressResponse)
def update_progress(
    day_number: int, 
    progress_update: UserProgressUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    day = db.query(DayPlan).filter(DayPlan.day_number == day_number).first()
    if not day:
        raise HTTPException(status_code=404, detail="Day not found")

    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.day_number == day_number
    ).first()

    # Check if this day is fully completed based on the update
    # In a real app we might validate strictly, but here we assume user marks whatever
    is_fully_completed = all([
        progress_update.dsa_completed,
        progress_update.ml_completed,
        progress_update.dev_completed,
        progress_update.deploy_completed
    ])

    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            day_number=day_number,
            dsa_completed=progress_update.dsa_completed,
            ml_completed=progress_update.ml_completed,
            dev_completed=progress_update.dev_completed,
            deploy_completed=progress_update.deploy_completed,
            is_day_completed=is_fully_completed,
            completed_at=datetime.utcnow() if is_fully_completed else None
        )
        db.add(progress)
    else:
        # If already completed before, we don't recalculate XP unless we allow un-completing
        was_completed = progress.is_day_completed
        progress.dsa_completed = progress_update.dsa_completed
        progress.ml_completed = progress_update.ml_completed
        progress.dev_completed = progress_update.dev_completed
        progress.deploy_completed = progress_update.deploy_completed
        
        if is_fully_completed and not was_completed:
            progress.is_day_completed = True
            progress.completed_at = datetime.utcnow()
        elif not is_fully_completed and was_completed:
            # Handle un-checking a box
            progress.is_day_completed = False
            progress.completed_at = None

    # Gamification Logic Update
    if is_fully_completed and (not progress.id or not progress.is_day_completed):
        # Determine if streak is missed (e.g., missed yesterday). 
        # For simplicity, we just increment streak if they haven't done it yet.
        # Strict timeline logic requires date checking.
        
        # Here we just blindly award XP if they complete a day they haven't completed before
        # In a real world, we'd check if last_completed_day == day_number - 1
        new_xp, new_level, new_streak = calculate_xp_and_level(
            current_xp=current_user.xp,
            old_streak=current_user.current_streak,
            new_streak=current_user.current_streak + 1,
            day_completed=True,
            is_missed=False
        )
        
        current_user.xp = new_xp
        current_user.level = new_level
        current_user.current_streak = new_streak
        current_user.last_completed_day = day_number
        if new_streak > current_user.max_streak:
            current_user.max_streak = new_streak

    db.commit()
    db.refresh(progress)
    return progress
