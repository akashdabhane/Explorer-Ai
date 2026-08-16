from fastapi import APIRouter
from app.schemas.chat import ChatRequest
from app.controllers.chat_controller import handle_post_chat

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post("/chat")
async def post_chat(data: ChatRequest):
    return await handle_post_chat(data)
