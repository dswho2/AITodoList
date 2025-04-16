# app/db/session.py
# Creates a database engine and session generator for dependency injection.

from sqlmodel import Session, create_engine
from app.core.config import settings

engine = create_engine(settings.database_url, echo=False)


def get_session():
    with Session(engine) as session:
        yield session