import json
import os
import sys

# Add backend directory to sys path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal, engine, Base
from app.models import DayPlan

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Read the JSON file
    json_path = os.path.join(os.path.dirname(__file__), '../roadmap.json')
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        print(f"Loaded {len(data)} days to seed...")
        
        for item in data:
            day_exists = db.query(DayPlan).filter(DayPlan.day_number == item.get("d")).first()
            if not day_exists:
                day_plan = DayPlan(
                    day_number=item.get("d"),
                    title=item.get("title"),
                    week=item.get("week"),
                    dsa_task=item.get("dsa", "No DSA task"),
                    ml_task=item.get("ml", "No ML task"),
                    dev_task=item.get("dev", "No Dev task"),
                    deploy_task=item.get("deploy", "No Deploy task")
                )
                db.add(day_plan)
        
        db.commit()
        print("Database seeding completed.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
