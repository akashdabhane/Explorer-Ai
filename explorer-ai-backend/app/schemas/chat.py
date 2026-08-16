from typing import Optional
from pydantic import BaseModel

class ChatRequest(BaseModel):
    notebookId: Optional[str] = "unknown"
    userId: Optional[str] = "unknown"
    question: Optional[str] = ""
