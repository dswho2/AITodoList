# app/core/config.py
# Loads environment variables and sets default values for database and CORS.

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    database_url: str = "sqlite:///./todos.db"
    openai_api_key: str
    cors_origins: List[str]

    class Config:
        env_file = ".env"


settings = Settings()
