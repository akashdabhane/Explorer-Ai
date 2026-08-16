from datetime import datetime
import bcrypt
from app.database.models import get_users_collection, format_doc


def register_user(name: str, email: str, password: str) -> dict:
    users_col = get_users_collection()
    if users_col is None:
        raise Exception("Database connection unavailable")

    email = email.strip().lower()

    # Check if existing user
    existing_user = users_col.find_one({"email": email})
    if existing_user:
        return {"error": "User already exists with this email", "status_code": 400}

    # Hash password using bcrypt
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')

    now = datetime.utcnow()
    user_doc = {
        "name": name,
        "email": email,
        "password": hashed_pw,
        "provider": "credentials",
        "createdAt": now,
        "updatedAt": now
    }

    result = users_col.insert_one(user_doc)
    user_id = str(result.inserted_id)

    return {
        "status_code": 201,
        "data": {
            "message": "User created successfully",
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }
    }


def verify_credentials(email: str, password: str) -> dict:
    users_col = get_users_collection()
    if users_col is None:
        return {"error": "Database unavailable", "status_code": 500}

    email = email.strip().lower()
    user = users_col.find_one({"email": email})
    if not user or "password" not in user:
        return {"error": "Invalid email or password", "status_code": 400}

    stored_hash = user["password"]
    try:
        is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
    except Exception:
        is_valid = False

    if not is_valid:
        return {"error": "Invalid email or password", "status_code": 400}

    return {
        "status_code": 200,
        "data": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", ""),
            "image": user.get("image", "")
        }
    }
