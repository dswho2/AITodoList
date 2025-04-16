# app/main.py
# Initializes FastAPI app, mounts GraphQL at /graphql, and auto-generates tables on startup.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.schema import graphql_app
from app.db.models import SQLModel
from app.db.session import engine
from app.api import stream
import os
import json

app = FastAPI()

origins = json.loads(os.getenv("CORS_ORIGINS", '["http://localhost:5173"]'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graphql_app, prefix="/graphql")
app.include_router(stream.router)

@app.on_event("startup")
def on_startup() -> None:
    SQLModel.metadata.create_all(engine)
