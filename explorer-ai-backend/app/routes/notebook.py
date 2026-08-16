from typing import Optional
from fastapi import APIRouter, Body, Query
from app.schemas.notebook import CreateNotebookRequest, UpdateNotebookRequest, StudioActionRequest
from app.controllers.notebook_controller import (
    handle_get_notebooks,
    handle_create_notebook,
    handle_get_notebook_by_id,
    handle_update_notebook,
    handle_delete_notebook,
    handle_get_notebook_documents,
    handle_get_conversation,
    handle_clear_conversation,
    handle_studio_action,
)

router = APIRouter(prefix="/api/notebooks", tags=["Notebooks"])


@router.get("")
@router.get("/")
async def get_notebooks(userId: Optional[str] = Query(None)):
    return await handle_get_notebooks(userId)


@router.post("")
@router.post("/")
async def create_notebook(data: Optional[CreateNotebookRequest] = Body(default=None)):
    return await handle_create_notebook(data)


@router.get("/{notebook_id}")
async def get_notebook(notebook_id: str):
    return await handle_get_notebook_by_id(notebook_id)


@router.patch("/{notebook_id}")
async def update_notebook(notebook_id: str, data: UpdateNotebookRequest):
    return await handle_update_notebook(notebook_id, data)


@router.delete("/{notebook_id}")
async def delete_notebook(notebook_id: str):
    return await handle_delete_notebook(notebook_id)


@router.get("/{notebook_id}/documents")
async def get_notebook_documents(notebook_id: str, userId: Optional[str] = Query(None)):
    return await handle_get_notebook_documents(notebook_id, userId)


@router.get("/{notebook_id}/conversation")
async def get_conversation(notebook_id: str):
    return await handle_get_conversation(notebook_id)


@router.delete("/{notebook_id}/conversation")
async def clear_conversation(notebook_id: str):
    return await handle_clear_conversation(notebook_id)


@router.post("/{notebook_id}/actions")
async def studio_action(notebook_id: str, data: StudioActionRequest, userId: Optional[str] = Query(None)):
    return await handle_studio_action(notebook_id, data, userId)
