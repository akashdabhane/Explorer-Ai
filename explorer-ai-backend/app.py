from flask import Flask, jsonify, request, Response, send_file
from flask_cors import CORS
import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter

from lib.llm import model
from lib.vector_db import dense_index, to_namespace_name
from utils.document_loaders import load_documents
from database.database import db


app = Flask(__name__)

CORS(app)

# load the .env file
load_dotenv()



# Config ============================
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER



@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200


@app.route("/api/upload", methods=["POST"])
def upload_file():

    notebookId = request.form.get("notebookId", "unknown")
    userId = request.form.get("userId", "unknown")
    sourceId = request.form.get("sourceId", "unknown")

    if not notebookId or not userId:
        return jsonify({"error": "Notebook ID and User ID are required"}), 400

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        # save file to uploads directory
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)

        # load document
        documents = load_documents(file_path)
        print(f"Documents : {documents}")

        # # add extracted data from documents to mongodb database
        # if db is not None:
        #     sources_collection = db["sources"]
        #     sources_collection.find_one_and_update(
        #         {"_id": sourceId},
        #         {"$set": {
        #             'sourceTitle': documents
        #         }},
        #         upsert=True
        #     )

        # remove/delete file from uploads directory after loading
        file_path = Path(file_path)
        if file_path.exists():
            file_path.unlink()
            print("File deleted successfully.")
        else:
            print("File does not exist.")

        # split into chunks
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

        dense_index.upsert_records(
            namespace=to_namespace_name(notebookId, userId),
            records=records
        )

        # response to client
        return jsonify(
            {
                "message": "Document uploaded successfully",
                "chunks_stored": len(chunks),
                "collection": to_namespace_name(notebookId, userId),
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Chat endpoint ============================
@app.route("/api/chat", methods=["POST"])
def post_chat():
    data = request.get_json()

    notebookId = data.get("notebookId", "unknown")
    userId = data.get("userId", "unknown")
    question = data.get("question", "")

    if not notebookId or not userId or not question:
        return jsonify({"error": "Notebook ID, User ID, and question are required"}), 400

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
    context = "\n\n".join([hit['fields']['chunk_text'] for hit in relevant_records['result']['hits']])

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

    for hit in relevant_records['result']['hits']:
        entry = {
            "source": hit['fields'].get("source", "unknown"),
            "page_label": hit['fields'].get("page_label", "unknown"),
        }
        key = (entry["source"], entry["page_label"])
        if key in seen_metadata:
            continue
        seen_metadata.add(key)
        unique_metadata.append(entry)

    return jsonify(
        {
            "question": question,
            "answer": answer,
            "retrieved_chunks": len(relevant_records['result']['hits']),
            "metadata": unique_metadata,
        }
    )


# remove document from vector database
@app.route("/api/remove_document", methods=["POST"])
def remove_document():
    data = request.get_json()

    notebookId = data.get("notebookId", "unknown")
    userId = data.get("userId", "unknown")
    sourceName = data.get("sourceName", "")

    if not notebookId or not userId or not sourceName:
        return jsonify({"error": "Notebook ID, User ID, and source name are required"}), 400

    try:
        namespace = to_namespace_name(notebookId, userId)
        dense_index.delete(
            filter={"source": {"$eq": f"uploads\\{sourceName}"}},
            namespace=namespace
        )

        return jsonify({"message": "Document removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def get_all_chunks_by_namespace(notebookId: str, userId: str):
    namespace = to_namespace_name(notebookId, userId)
    try:
        # Retrieve all records in the namespace
        all_records = dense_index.fetch(namespace=namespace)
        return all_records
    except Exception as e:
        return {"error": str(e)}, 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
