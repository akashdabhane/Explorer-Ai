from fastapi import APIRouter
from app.schemas.auth import SignupRequest, VerifyRequest
from app.controllers.auth_controller import handle_signup, handle_verify

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/signup")
async def signup(data: SignupRequest):
    return await handle_signup(data)

@router.post("/login")
@router.post("/signin")
@router.post("/verify")
async def login(data: VerifyRequest):
    return await handle_verify(data)
