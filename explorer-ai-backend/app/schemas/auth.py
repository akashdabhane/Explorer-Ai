from typing import Optional
from pydantic import BaseModel

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class VerifyRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
