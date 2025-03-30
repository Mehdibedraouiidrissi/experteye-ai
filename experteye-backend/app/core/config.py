
from pydantic import BaseSettings
import os

class Settings(BaseSettings):
    SECRET_KEY: str = "ExpertEyeSecretKey123"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Paths
    DATA_DIR: str = "../data"
    DOCUMENTS_DIR: str = "../data/documents"
    DATABASE_DIR: str = "../database"
    
    class Config:
        env_file = ".env"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.DATA_DIR, exist_ok=True)
os.makedirs(settings.DOCUMENTS_DIR, exist_ok=True)
os.makedirs(settings.DATABASE_DIR, exist_ok=True)
