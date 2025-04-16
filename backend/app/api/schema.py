# app/api/schema.py
# Defines GraphQL types, queries for fetching todos, and mutations for adding/completing/trashing them.

import strawberry
from typing import List
from sqlmodel import select
from sqlalchemy import not_
from strawberry.fastapi import GraphQLRouter
from app.db.models import Todo
from app.db.session import get_session
from strawberry.types import Info


@strawberry.type
class TodoType:
    id: str
    text: str
    is_complete: bool = strawberry.field(name="isComplete")
    is_trashed: bool = strawberry.field(name="isTrashed")
    created_at: str = strawberry.field(name="createdAt")


@strawberry.type
class Query:
    @strawberry.field
    def todos(self, info: Info) -> List[TodoType]:
        session = next(get_session())
        todos = session.exec(select(Todo).where(not_(Todo.is_trashed))).all()
        return [TodoType(**todo.dict()) for todo in todos]


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_todo(self, info: Info, text: str) -> TodoType:
        session = next(get_session())
        todo = Todo(text=text)
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return TodoType(**todo.dict())

    @strawberry.mutation
    def complete_todo(self, info: Info, id: str) -> TodoType:
        session = next(get_session())
        todo = session.get(Todo, id)
        if not todo:
            raise ValueError(f"Todo with id {id} not found")
        todo.is_complete = not todo.is_complete
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return TodoType(**todo.dict())

    @strawberry.mutation
    def trash_todo(self, info: Info, id: str) -> TodoType:
        session = next(get_session())
        todo = session.get(Todo, id)
        if not todo:
            raise ValueError(f"Todo with id {id} not found")
        todo.is_trashed = True
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return TodoType(**todo.dict())


schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema)
