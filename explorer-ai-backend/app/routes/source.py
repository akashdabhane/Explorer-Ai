from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.source import UpdateSourceRequest
from app.controllers.source_controller import (
    handle_get_source_by_id,
    handle_update_source,
    handle_delete_source,
)

router = APIRouter(tags=["Sources"])


@router.get("/api/sources/{source_id}")
@router.get("/api/documents/{source_id}")
async def get_source(source_id: str):
    return await handle_get_source_by_id(source_id)


@router.patch("/api/sources/{source_id}")
@router.patch("/api/documents/{source_id}")
async def update_source(source_id: str, data: UpdateSourceRequest):
    return await handle_update_source(source_id, data)


@router.delete("/api/sources/{source_id}")
@router.delete("/api/documents/{source_id}")
async def delete_source(source_id: str, userId: Optional[str] = Query(None)):
    return await handle_delete_source(source_id, userId)
