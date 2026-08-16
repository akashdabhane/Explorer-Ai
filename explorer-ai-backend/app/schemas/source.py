from typing import Optional
from pydantic import BaseModel

class UpdateSourceRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sourceType: Optional[str] = None
