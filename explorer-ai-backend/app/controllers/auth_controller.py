from fastapi.responses import JSONResponse
from app.schemas.auth import SignupRequest, VerifyRequest
from app.services.auth_service import register_user, verify_credentials


async def handle_signup(data: SignupRequest):
    if not data.name or not data.email or not data.password:
        return JSONResponse(
            status_code=400,
            content={"error": "Please provide all required fields"}
        )

    if len(data.password) < 8:
        return JSONResponse(
            status_code=400,
            content={"error": "Password must be at least 8 characters"}
        )

    try:
        res = register_user(data.name, data.email, data.password)
        if "error" in res:
            return JSONResponse(
                status_code=res.get("status_code", 400),
                content={"error": res["error"]}
            )
        return JSONResponse(
            status_code=res.get("status_code", 201),
            content=res.get("data", {})
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e) or "Failed to create user"}
        )


async def handle_verify(data: VerifyRequest):
    if not data.email or not data.password:
        return JSONResponse(
            status_code=400,
            content={"error": "Please provide email and password"}
        )

    try:
        res = verify_credentials(data.email, data.password)
        if "error" in res:
            return JSONResponse(
                status_code=res.get("status_code", 400),
                content={"error": res["error"]}
            )
        return JSONResponse(
            status_code=res.get("status_code", 200),
            content=res.get("data", {})
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e) or "Failed to verify credentials"}
        )
