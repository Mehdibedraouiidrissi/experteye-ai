
import json
import os
import uuid
from datetime import datetime
from typing import List, Dict, Any

from app.core.config import settings

# JSON database paths
USERS_DB_PATH = os.path.join(settings.DATABASE_DIR, "users.json")
CHATS_DB_PATH = os.path.join(settings.DATABASE_DIR, "chats.json")
DOCUMENTS_DB_PATH = os.path.join(settings.DATABASE_DIR, "documents.json")
MESSAGES_DB_PATH = os.path.join(settings.DATABASE_DIR, "messages.json")

# Ensure database files exist
def init_db():
    for db_path in [USERS_DB_PATH, CHATS_DB_PATH, DOCUMENTS_DB_PATH, MESSAGES_DB_PATH]:
        if not os.path.exists(db_path):
            with open(db_path, "w") as f:
                json.dump([], f)

init_db()

# Database access functions
def get_user_db():
    try:
        with open(USERS_DB_PATH, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_user_db(users):
    with open(USERS_DB_PATH, "w") as f:
        json.dump(users, f, indent=2, default=str)

def get_chat_db():
    try:
        with open(CHATS_DB_PATH, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_chat_db(chats):
    with open(CHATS_DB_PATH, "w") as f:
        json.dump(chats, f, indent=2, default=str)

def get_document_db():
    try:
        with open(DOCUMENTS_DB_PATH, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_document_db(documents):
    with open(DOCUMENTS_DB_PATH, "w") as f:
        json.dump(documents, f, indent=2, default=str)

def get_message_db():
    try:
        with open(MESSAGES_DB_PATH, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_message_db(messages):
    with open(MESSAGES_DB_PATH, "w") as f:
        json.dump(messages, f, indent=2, default=str)
