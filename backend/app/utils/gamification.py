def calculate_xp_and_level(current_xp: int, old_streak: int, new_streak: int, day_completed: bool, is_missed: bool):
    """
    Calculates the new XP, Level, and Streak for a user depending on whether they completed a day.
    Base XP for a day: +100
    Streak bonus: +10 XP for each day continuous (cap at +100)
    """
    xp_gain = 0
    updated_streak = old_streak
    
    if is_missed:
        updated_streak = 0
        return current_xp, _get_level_from_xp(current_xp), updated_streak

    if day_completed:
        # User completed the current day
        updated_streak = old_streak + 1
        base_xp = 100
        streak_bonus = min(updated_streak * 10, 100) # Max +100 streak bonus
        
        # Additional Milestones
        milestone_bonus = 0
        if updated_streak == 7: milestone_bonus = 500
        elif updated_streak == 30: milestone_bonus = 2000
        elif updated_streak == 60: milestone_bonus = 5000

        xp_gain = base_xp + streak_bonus + milestone_bonus

    new_xp = current_xp + xp_gain
    new_level = _get_level_from_xp(new_xp)
    
    return new_xp, new_level, updated_streak

def _get_level_from_xp(xp: int) -> int:
    """
    Lv1: 0 - 200
    Lv2: 200 - 500
    Lv3: 500 - 1000
    Lv4: 1000 - 1500
    Lv5: 1500 - 2500
    Lv6: 2500 - 4000
    Lv7: 4000 - 6000
    ...
    Formula or static boundaries:
    """
    boundaries = [
        (0, 1),
        (200, 2),
        (500, 3),
        (1000, 4),
        (1500, 5),
        (2500, 6),
        (4000, 7),
        (6000, 8),
        (8500, 9),
        (12000, 10)
    ]
    level = 1
    for bound in boundaries:
        if xp >= bound[0]:
            level = bound[1]
    return level
