import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator
from typing import Literal

class Settings(BaseSettings):
    """Application configuration loaded from environment variables or .env file."""
    MONGODB_URL: str
    DATABASE_NAME: str = "kryptoguard"
    SECRET_KEY: str = "change-me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    FRONTEND_URL: str = "http://localhost:5175"
    ENVIRONMENT: str = "development"

    # CORS origins – allow only the configured frontend URL
    CORS_ORIGINS: list[str] = []

    model_config = SettingsConfigDict(env_file=Path(__file__).resolve().parents[1] / ".env", env_file_encoding="utf-8")

    @model_validator(mode='after')
    def validate_settings(cls, values):
        if not values.MONGODB_URL:
            raise ValueError('MONGODB_URL is required in .env or environment variables.')

        env_mode = (values.ENVIRONMENT or "development").strip().lower()
        if env_mode in ("production", "prod"):
            if not values.SECRET_KEY or values.SECRET_KEY == "change-me":
                raise ValueError("In production, SECRET_KEY cannot use the default 'change-me' value.")
            if len(values.SECRET_KEY) < 32:
                raise ValueError("In production, SECRET_KEY must be at least 32 characters long.")
        return values

    def __post_init__(self):
        # Populate CORS origins from FRONTEND_URL if not explicitly set
        if not self.CORS_ORIGINS:
            self.CORS_ORIGINS = [self.FRONTEND_URL]

settings = Settings()
