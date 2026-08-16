from typing import Optional
from fastapi import UploadFile
from fastapi.responses import JSONResponse
from app.schemas.document import RemoveDocumentRequest
from app.services.document_service import process_and_store_document, remove_document_by_name


async def handle_upload_document(
    file: Optional[UploadFile],
    notebookId: Optional[str],
    userId: Optional[str],
    sourceId: Optional[str] = None
):
    if not notebookId or not userId or notebookId == "unknown" or userId == "unknown":
        return JSONResponse(
            status_code=400,
            content={"error": "Notebook ID and User ID are required"}
        )

    if file is None or not file.filename:
        return JSONResponse(
            status_code=400,
            content={"error": "No file provided"}
        )

    try:
        result = await process_and_store_document(file, notebookId, userId, sourceId)
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


async def handle_remove_document(data: RemoveDocumentRequest):
    notebookId = data.notebookId or "unknown"
    userId = data.userId or "unknown"
    sourceName = data.sourceName or ""

    if not notebookId or not userId or not sourceName or notebookId == "unknown" or userId == "unknown":
        return JSONResponse(
            status_code=400,
            content={"error": "Notebook ID, User ID, and source name are required"}
        )

    try:
        result = remove_document_by_name(notebookId, userId, sourceName)
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
