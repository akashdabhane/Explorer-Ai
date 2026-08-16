from pinecone import Pinecone
import os
import re
from dotenv import load_dotenv

load_dotenv()


VECTOR_DB_DIR = "explorer-notebooklm-db"

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



# Helper function to create a namespace name based on notebookId and userId
def to_namespace_name(notebookId: str, userId: str) -> str:
    # Replace non-alphanumeric characters with underscores
    sanitized_notebookId = re.sub(r'\W+', '_', notebookId)
    sanitized_userId = re.sub(r'\W+', '_', userId)
    return f"{sanitized_userId}_{sanitized_notebookId}"

