from datetime import datetime
from typing import Optional, Dict, Any
from app.database.models import get_sources_collection, parse_id, format_doc
from lib.vector_db import dense_index, to_namespace_name


def get_source_by_id(source_id: str) -> Optional[Dict[str, Any]]:
    col = get_sources_collection()
    if col is None:
        return None
    parsed = parse_id(source_id)
    if not parsed:
        return None
    doc = col.find_one({"_id": parsed})
    return format_doc(doc)


def update_source_doc(source_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    col = get_sources_collection()
    if col is None:
        return None
    parsed = parse_id(source_id)
    if not parsed:
        return None

    clean_updates = {k: v for k, v in updates.items() if v is not None}
    clean_updates["updatedAt"] = datetime.utcnow()

    res = col.find_one_and_update(
        {"_id": parsed},
        {"$set": clean_updates},
        return_document=True
    )
    return format_doc(res)


def delete_source_doc(source_id: str, user_id: Optional[str] = None) -> bool:
    col = get_sources_collection()
    if col is None:
        return False
    parsed = parse_id(source_id)
    if not parsed:
        return False

    source_doc = col.find_one({"_id": parsed})
    if not source_doc:
        return False

    # Remove from Pinecone vector index if notebookId and userId are available
    notebook_id_str = str(source_doc.get("notebookId", ""))
    user_id_str = str(source_doc.get("userId", user_id or ""))
    source_title = source_doc.get("sourceTitle", "")

    if notebook_id_str and user_id_str:
        try:
            namespace = to_namespace_name(notebook_id_str, user_id_str)
            dense_index.delete(
                filter={"source": {"$eq": f"uploads\\{source_title}"}},
                namespace=namespace
            )
        except Exception as e:
            print("Pinecone cleanup warning:", e)

    res = col.delete_one({"_id": parsed})
    return res.deleted_count > 0
