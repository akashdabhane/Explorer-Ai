from flask import Flask, jsonify, request, Response, send_file
from flask_cors import CORS
import os
import re
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone


app = Flask(__name__)

CORS(app)

# load the .env file
load_dotenv()



VECTOR_DB_DIR = "explorer-notebooklm-db"


# LLM configuration ============================
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

# Initialize a Pinecone client with your API key
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Create an index for dense vectors with integrated embedding
index_name = VECTOR_DB_DIR
if not pc.has_index(index_name):
    pc.create_index_for_model(
        name=index_name,
        cloud="aws",
        region="us-east-1",
        embed={
            "model":"llama-text-embed-v2",
            "field_map":{"text": "chunk_text"}
        }
    )

# Target the index
dense_index = pc.Index(index_name)


# Config ============================
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# Load documents helper function ============================
def load_documents(file_path):
    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        loader = PyPDFLoader(file_path)
    elif extension == ".txt":
        loader = TextLoader(file_path)
    elif extension in [".docx", ".doc"]:
        loader = Docx2txtLoader(file_path)
    else:
        raise ValueError("Unsupported file type: {}".format(extension))

    documents = loader.load()
    return documents


def to_namespace_name(email_id: str) -> str:
    safe_id = re.sub(r"[^a-zA-Z0-9._-]", "_", email_id)
    safe_id = safe_id.strip("._-")

    if len(safe_id) < 3:
        safe_id = f"user_{safe_id}" if safe_id else "user_default"

    if len(safe_id) > 512:
        safe_id = safe_id[:512]

    return f"user_{safe_id}"

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route("/api/upload", methods=["POST"])
def upload_file():

    email_id = request.form.get("email_id", "unknown")
    if not email_id:
        return jsonify({"error": "Email ID is required"}), 400

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
            namespace=to_namespace_name(email_id), 
            records=records
        )

        # response to client
        return jsonify(
            {
                "message": "Document uploaded successfully",
                "chunks_stored": len(chunks),
                "collection": to_namespace_name(email_id),
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Chat pinecone endpoint ============================
@app.route("/api/chat", methods=["POST"])
def post_chat():
    data = request.get_json()

    email_id = data.get("email_id", "unknown")
    question = data.get("question", "")

    if not email_id or not question:
        return jsonify({"error": "email_id and question are required"}), 400    

  
    # Search the index
    relevant_records = dense_index.search(
        namespace="company_policies" if email_id == "company_policies" else to_namespace_name(email_id),
        query={
            "top_k": 4,
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

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
