from typing import Optional
from fastapi.responses import JSONResponse
from app.schemas.source import UpdateSourceRequest
from app.services.source_service import (
    get_source_by_id,
    update_source_doc,
    delete_source_doc,
)


async def handle_get_source_by_id(source_id: str):
    try:
        source = get_source_by_id(source_id)
        if not source:
            return JSONResponse(status_code=404, content={"error": "Sources not found"})
        return {"data": source, "message": "Sources fetch successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to fetch sources"})


async def handle_update_source(source_id: str, data: UpdateSourceRequest):
    try:
        updates = data.dict(exclude_unset=True)
        source = update_source_doc(source_id, updates)
        if not source:
            return JSONResponse(status_code=404, content={"error": "Source not found"})
        return {"message": "Source updated successfully", "source": source}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to update source"})


async def handle_delete_source(source_id: str, userId: Optional[str] = None):
    try:
        success = delete_source_doc(source_id, userId)
        if not success:
            return JSONResponse(status_code=404, content={"error": "Source not found"})
        return {"message": "Document deleted successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to delete source"})
