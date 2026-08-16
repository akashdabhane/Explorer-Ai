from typing import Optional
from pydantic import BaseModel

class CreateNotebookRequest(BaseModel):
    notebookTitle: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = ""
    color: Optional[str] = "#3b82f6"
    userId: Optional[str] = None

class UpdateNotebookRequest(BaseModel):
    notebookTitle: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    userId: Optional[str] = None

class StudioActionRequest(BaseModel):
    type: str # summary, studyGuide, faq, timeline
