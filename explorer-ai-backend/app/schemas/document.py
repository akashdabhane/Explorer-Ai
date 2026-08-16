from typing import Optional
from pydantic import BaseModel

class RemoveDocumentRequest(BaseModel):
    notebookId: Optional[str] = "unknown"
    userId: Optional[str] = "unknown"
    sourceName: Optional[str] = ""
