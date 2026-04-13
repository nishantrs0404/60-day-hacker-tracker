from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "60-Day Performance Tracker"
    # To run locally with docker-compose: postgresql://user:pass@localhost:5432/mydb
    # Since we use async sqlalchemy, we need asyncpg or psycopg. We'll use psycopg2-binary for sync, but async is better. 
    # To keep it robust without async complexities for simple REST, we'll use sync SQLAlchemy ORM
    DATABASE_URL: str = "postgresql://user:pass@localhost:5432/mydb"
    SECRET_KEY: str = "supersecretkey_please_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
