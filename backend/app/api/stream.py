# app/api/stream.py
# Streams a new AI-generated todo based on existing todos in the database.

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from openai import OpenAIError
import openai

from app.core.config import settings
from app.db.session import get_session
from app.db.models import Todo
from sqlmodel import select

router = APIRouter()


@router.get("/generate-stream")
def stream_todo():
    session = next(get_session())
    todos = session.exec(select(Todo)).all()
    todo_texts = [todo.text for todo in todos if not todo.is_trashed]

    prompt = (
        "Here are the following existing todos:\n\n"
        + "\n".join(todo_texts)
        + "\n\nSuggest one new todo based on those existing already."
    )

    def generate():
        try:
            openai.api_key = settings.openai_api_key
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                stream=True,
            )
            for chunk in response:
                if "choices" in chunk:
                    delta = chunk["choices"][0]["delta"]
                    content = delta.get("content")
                    if content:
                        yield content
        except OpenAIError:
            yield "[error] Failed to generate todo."

    return StreamingResponse(generate(), media_type="text/plain")
