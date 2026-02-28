from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Pay Later Service"
    APP_VERSION: str = "1.0.0"
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/paylater"
    SECRET_KEY: str = "change-this-secret-key-in-production-make-it-at-least-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
