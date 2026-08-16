from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile
from app.schemas.document import RemoveDocumentRequest
from app.controllers.document_controller import handle_upload_document, handle_remove_document

router = APIRouter(tags=["Document"])


@router.post("/api/upload")
@router.post("/api/documents/upload")
@router.post("/api/sources/upload")
async def upload_file(
    file: Optional[UploadFile] = File(None),
    notebookId: Optional[str] = Form(None),
    userId: Optional[str] = Form(None),
    sourceId: Optional[str] = Form(None),
):
    return await handle_upload_document(file, notebookId, userId, sourceId)


@router.post("/api/remove_document")
async def remove_document(data: RemoveDocumentRequest):
    return await handle_remove_document(data)
