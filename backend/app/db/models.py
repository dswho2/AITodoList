# app/db/models.py
# Defines the Todo model. Fields are typed, and id is a UUID by default.

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class Todo(SQLModel, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    text: str
    is_complete: bool = False
    is_trashed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)