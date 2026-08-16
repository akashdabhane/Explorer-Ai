from fastapi.responses import JSONResponse
from app.schemas.chat import ChatRequest
from app.services.chat_service import generate_chat_response


async def handle_post_chat(data: ChatRequest):
    notebookId = data.notebookId or "unknown"
    userId = data.userId or "unknown"
    question = data.question or ""

    if not notebookId or not userId or not question or notebookId == "unknown" or userId == "unknown":
        return JSONResponse(
            status_code=400,
            content={"error": "Notebook ID, User ID, and question are required"}
        )

    try:
        result = generate_chat_response(notebookId, userId, question)
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
