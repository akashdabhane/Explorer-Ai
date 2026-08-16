from typing import Optional
from fastapi.responses import JSONResponse
from app.schemas.notebook import CreateNotebookRequest, UpdateNotebookRequest, StudioActionRequest
from app.services.notebook_service import (
    get_notebooks_for_user,
    create_notebook_doc,
    get_notebook_by_id,
    update_notebook_doc,
    delete_notebook_doc,
    get_notebook_sources,
    get_conversation_history,
    clear_conversation_history,
    generate_studio_action,
)


async def handle_get_notebooks(userId: Optional[str] = None):
    try:
        notebooks = get_notebooks_for_user(userId)
        return {"notebooks": notebooks}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to fetch notebooks"})


async def handle_create_notebook(data: Optional[CreateNotebookRequest] = None):
    title = "Untitled Notebook"
    description = ""
    color = "#3b82f6"
    userId = None

    if data is not None:
        title = data.notebookTitle or data.title or "Untitled Notebook"
        description = data.description or ""
        color = data.color or "#3b82f6"
        userId = data.userId

    try:
        notebook = create_notebook_doc(
            user_id=userId,
            title=title,
            description=description,
            color=color
        )
        return JSONResponse(status_code=201, content={"notebook": notebook})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to create notebook"})


async def handle_get_notebook_by_id(notebook_id: str):
    try:
        notebook = get_notebook_by_id(notebook_id)
        if not notebook:
            return JSONResponse(status_code=404, content={"error": "Notebook not found"})
        return {"notebook": notebook}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to fetch notebook"})


async def handle_update_notebook(notebook_id: str, data: UpdateNotebookRequest):
    try:
        updates = data.dict(exclude_unset=True)
        if "title" in updates and "notebookTitle" not in updates:
            updates["notebookTitle"] = updates["title"]
        notebook = update_notebook_doc(notebook_id, updates)
        if not notebook:
            return JSONResponse(status_code=404, content={"error": "Notebook not found"})
        return {"message": "Notebook updated successfully", "notebook": notebook}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to update notebook"})


async def handle_delete_notebook(notebook_id: str):
    try:
        success = delete_notebook_doc(notebook_id)
        if not success:
            return JSONResponse(status_code=404, content={"error": "Notebook not found"})
        return {"message": "Notebook deleted successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to delete notebook"})


async def handle_get_notebook_documents(notebook_id: str, userId: Optional[str] = None):
    try:
        sources = get_notebook_sources(notebook_id, userId)
        return {"sources": sources, "documents": sources}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to fetch documents"})


async def handle_get_conversation(notebook_id: str):
    try:
        history = get_conversation_history(notebook_id)
        return {"conversationHistory": history}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to fetch conversation"})


async def handle_clear_conversation(notebook_id: str):
    try:
        success = clear_conversation_history(notebook_id)
        if not success:
            return JSONResponse(status_code=404, content={"error": "Notebook not found"})
        return {"message": "Conversation cleared successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Failed to clear conversation"})


async def handle_studio_action(notebook_id: str, data: StudioActionRequest, userId: Optional[str] = None):
    if data.type not in ["summary", "studyGuide", "faq", "timeline"]:
        return JSONResponse(status_code=400, content={"error": "Invalid action type"})

    try:
        result = generate_studio_action(notebook_id, data.type, userId)
        return {"result": result, "type": data.type}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e) or "Failed to generate result"})
