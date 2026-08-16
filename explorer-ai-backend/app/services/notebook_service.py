from datetime import datetime
from typing import Optional, List, Dict, Any
from bson import ObjectId
from app.database.models import get_notebooks_collection, get_sources_collection, parse_id, format_doc
from lib.llm import model
from lib.vector_db import dense_index, to_namespace_name


def get_notebooks_for_user(user_id: Optional[str]) -> List[Dict[str, Any]]:
    col = get_notebooks_collection()
    if col is None:
        return []
    
    query = {}
    if user_id:
        parsed_u = parse_id(user_id)
        if parsed_u:
            query["$or"] = [{"userId": parsed_u}, {"userId": user_id}]
        else:
            query["userId"] = user_id

    notebooks = list(col.find(query).sort("createdAt", -1))
    return [format_doc(n) for n in notebooks]


def create_notebook_doc(user_id: Optional[str], title: str, description: str = "", color: str = "#3b82f6") -> Dict[str, Any]:
    col = get_notebooks_collection()
    if col is None:
        raise Exception("Database unavailable")

    now = datetime.utcnow()
    parsed_u = parse_id(user_id) if user_id else None

    notebook_doc = {
        "userId": parsed_u or user_id or "unknown",
        "notebookTitle": title,
        "description": description or "",
        "color": color or "#3b82f6",
        "sources": [],
        "chat": [],
        "conversationHistory": [],
        "createdAt": now,
        "updatedAt": now,
    }

    res = col.insert_one(notebook_doc)
    notebook_doc["_id"] = str(res.inserted_id)
    notebook_doc["id"] = str(res.inserted_id)
    return format_doc(notebook_doc)


def get_notebook_by_id(notebook_id: str) -> Optional[Dict[str, Any]]:
    col = get_notebooks_collection()
    if col is None:
        return None
    parsed_id = parse_id(notebook_id)
    if not parsed_id:
        return None
    doc = col.find_one({"_id": parsed_id})
    return format_doc(doc)


def update_notebook_doc(notebook_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    col = get_notebooks_collection()
    if col is None:
        return None
    parsed_id = parse_id(notebook_id)
    if not parsed_id:
        return None

    clean_updates = {k: v for k, v in updates.items() if v is not None}
    clean_updates["updatedAt"] = datetime.utcnow()

    res = col.find_one_and_update(
        {"_id": parsed_id},
        {"$set": clean_updates},
        return_document=True
    )
    return format_doc(res)


def delete_notebook_doc(notebook_id: str) -> bool:
    col = get_notebooks_collection()
    sources_col = get_sources_collection()
    if col is None:
        return False

    parsed_id = parse_id(notebook_id)
    if not parsed_id:
        return False

    # Delete associated sources if sources collection exists
    if sources_col is not None:
        sources_col.delete_many({"$or": [{"notebookId": parsed_id}, {"notebookId": notebook_id}]})

    res = col.delete_one({"_id": parsed_id})
    return res.deleted_count > 0


def get_notebook_sources(notebook_id: str, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    col = get_sources_collection()
    if col is None:
        return []

    parsed_n = parse_id(notebook_id)
    query = {"$or": [{"notebookId": parsed_n}, {"notebookId": notebook_id}]} if parsed_n else {"notebookId": notebook_id}
    
    if user_id:
        parsed_u = parse_id(user_id)
        u_query = {"$or": [{"userId": parsed_u}, {"userId": user_id}]} if parsed_u else {"userId": user_id}
        query = {"$and": [query, u_query]}

    sources = list(col.find(query).sort("createdAt", -1))
    return [format_doc(s) for s in sources]


def get_conversation_history(notebook_id: str) -> List[Dict[str, Any]]:
    nb = get_notebook_by_id(notebook_id)
    if not nb:
        return []
    return nb.get("conversationHistory", [])


def clear_conversation_history(notebook_id: str) -> bool:
    col = get_notebooks_collection()
    if col is None:
        return False
    parsed_id = parse_id(notebook_id)
    if not parsed_id:
        return False

    res = col.update_one(
        {"_id": parsed_id},
        {"$set": {"conversationHistory": [], "updatedAt": datetime.utcnow()}}
    )
    return res.modified_count > 0


def generate_studio_action(notebook_id: str, action_type: str, user_id: Optional[str] = None) -> str:
    # Retrieve sources or vector DB records for this notebook
    sources = get_notebook_sources(notebook_id, user_id)
    context_text = "\n\n".join([f"Source: {s.get('sourceTitle', 'Untitled')}\n" for s in sources])

    prompt_templates = {
        "summary": f"Generate a comprehensive summary of the provided notebook sources:\n\n{context_text}",
        "studyGuide": f"Generate a detailed study guide based on the provided notebook sources:\n\n{context_text}",
        "faq": f"Generate a list of Frequently Asked Questions (FAQs) with detailed answers based on the provided notebook sources:\n\n{context_text}",
        "timeline": f"Generate a chronological timeline of key events or concepts from the provided notebook sources:\n\n{context_text}",
    }

    prompt = prompt_templates.get(action_type, f"Summarize the notebook sources:\n\n{context_text}")
    res = model.generate_content(prompt)
    return res.text
