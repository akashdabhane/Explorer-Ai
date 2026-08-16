import os
from pathlib import Path
from typing import Optional
from datetime import datetime
from fastapi import UploadFile
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import UPLOAD_FOLDER
from app.database.models import get_sources_collection, parse_id, format_doc
from lib.vector_db import dense_index, to_namespace_name
from utils.document_loaders import load_documents


async def process_and_store_document(
    file: UploadFile,
    notebookId: str,
    userId: str,
    sourceId: Optional[str] = None
) -> dict:
    # Save file to uploads directory
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Load document
    documents = load_documents(file_path)
    print(f"Documents : {documents}")

    # Remove/delete file from uploads directory after loading
    file_path_obj = Path(file_path)
    if file_path_obj.exists():
        file_path_obj.unlink()
        print("File deleted successfully.")
    else:
        print("File does not exist.")

    # Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=400
    )
    chunks = text_splitter.split_documents(documents)

    records = []
    for i, chunk in enumerate(chunks):
        records.append({
            "_id": str(i),
            "chunk_text": chunk.page_content,
            **chunk.metadata
        })

    namespace = to_namespace_name(notebookId, userId)
    dense_index.upsert_records(
        namespace=namespace,
        records=records
    )

    # Persist Document record in MongoDB sources collection
    sources_col = get_sources_collection()
    source_record = None
    if sources_col is not None:
        extension = os.path.splitext(file.filename)[1].lower().lstrip(".")
        now = datetime.utcnow()
        parsed_nb = parse_id(notebookId) or notebookId
        parsed_u = parse_id(userId) or userId

        doc_data = {
            "notebookId": parsed_nb,
            "userId": parsed_u,
            "sourceTitle": file.filename,
            "fileName": file.filename,
            "originalFileName": file.filename,
            "sourceType": extension or "file",
            "fileType": extension or "file",
            "fileSize": len(contents),
            "totalChunks": len(chunks),
            "status": "completed",
            "createdAt": now,
            "updatedAt": now
        }
        res = sources_col.insert_one(doc_data)
        doc_data["_id"] = str(res.inserted_id)
        doc_data["id"] = str(res.inserted_id)
        source_record = format_doc(doc_data)

    return {
        "message": "Document uploaded successfully",
        "chunks_stored": len(chunks),
        "collection": namespace,
        "source": source_record,
        "document": source_record,
    }


def remove_document_by_name(notebookId: str, userId: str, sourceName: str) -> dict:
    namespace = to_namespace_name(notebookId, userId)
    dense_index.delete(
        filter={"source": {"$eq": f"uploads\\{sourceName}"}},
        namespace=namespace
    )
    return {"message": "Document removed successfully"}


def get_all_chunks_by_namespace(notebookId: str, userId: str):
    namespace = to_namespace_name(notebookId, userId)
    try:
        all_records = dense_index.fetch(namespace=namespace)
        return all_records
    except Exception as e:
        return {"error": str(e)}
