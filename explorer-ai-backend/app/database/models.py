from typing import Any, Dict, List, Optional
from bson import ObjectId
from datetime import datetime
from database.database import db

def parse_id(id_str: str) -> Optional[ObjectId]:
    try:
        return ObjectId(id_str)
    except Exception:
        return None

def format_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not doc:
        return None
    doc["id"] = str(doc.get("_id"))
    doc["_id"] = str(doc.get("_id"))
    for k, v in list(doc.items()):
        if isinstance(v, ObjectId):
            doc[k] = str(v)
        elif isinstance(v, datetime):
            doc[k] = v.isoformat()
        elif isinstance(v, list):
            formatted_list = []
            for item in v:
                if isinstance(item, ObjectId):
                    formatted_list.append(str(item))
                elif isinstance(item, datetime):
                    formatted_list.append(item.isoformat())
                elif isinstance(item, dict):
                    formatted_list.append(format_doc(item))
                else:
                    formatted_list.append(item)
            doc[k] = formatted_list
    return doc

# Collection accessors
def get_users_collection():
    return db["users"] if db is not None else None

def get_notebooks_collection():
    return db["notebooks"] if db is not None else None

def get_sources_collection():
    return db["sources"] if db is not None else None

def get_chats_collection():
    return db["chatmessages"] if db is not None else None
