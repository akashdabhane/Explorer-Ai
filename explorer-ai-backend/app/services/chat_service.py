from datetime import datetime
from app.database.models import get_notebooks_collection, parse_id
from lib.llm import model
from lib.vector_db import dense_index, to_namespace_name


def generate_chat_response(notebookId: str, userId: str, question: str) -> dict:
    # Search the index
    relevant_records = dense_index.search(
        namespace=to_namespace_name(notebookId, userId),
        query={
            "top_k": 5,
            "inputs": {
                'text': question
            }
        }
    )

    print("Search results:", relevant_records)

    # CREATE CONTEXT
    hits = relevant_records.get('result', {}).get('hits', [])
    context = "\n\n".join([hit['fields']['chunk_text'] for hit in hits if 'fields' in hit and 'chunk_text' in hit['fields']])

    # PROMPT
    prompt = f"""
You are a helpful AI assistant.

Answer the user's question ONLY using the provided context.

If answer is not available in context,
say:
"I could not find relevant information in the documents."

CONTEXT:
{context}

QUESTION:
{question}
"""

    # GEMINI RESPONSE
    response = model.generate_content(prompt)
    answer = response.text

    # Ensure unique metadata entries for response
    seen_metadata = set()
    unique_metadata = []

    for hit in hits:
        fields = hit.get('fields', {})
        entry = {
            "source": fields.get("source", "unknown"),
            "page_label": fields.get("page_label", "unknown"),
        }
        key = (entry["source"], entry["page_label"])
        if key in seen_metadata:
            continue
        seen_metadata.add(key)
        unique_metadata.append(entry)

    # Persist in conversation history in MongoDB notebooks collection
    nb_col = get_notebooks_collection()
    if nb_col is not None and notebookId and notebookId != "unknown":
        parsed_nb = parse_id(notebookId)
        if parsed_nb:
            now = datetime.utcnow()
            user_msg = {"role": "user", "content": question, "timestamp": now}
            assistant_msg = {"role": "assistant", "content": answer, "sources": unique_metadata, "timestamp": now}
            nb_col.update_one(
                {"_id": parsed_nb},
                {"$push": {"conversationHistory": {"$each": [user_msg, assistant_msg]}}}
            )

    return {
        "question": question,
        "answer": answer,
        "retrieved_chunks": len(hits),
        "metadata": unique_metadata,
        "sources": unique_metadata,
    }
