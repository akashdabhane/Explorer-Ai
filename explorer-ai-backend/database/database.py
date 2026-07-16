from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

try: 
    client = MongoClient(os.getenv("MONGODB_URI"))
    db = client["explorer"]
    print("Connected to MongoDB successfully.")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    db = None

# users_collection = db["users"] 
# users = users_collection.find()
# print("Users in the database:")
# for user in users:
#     print(user)