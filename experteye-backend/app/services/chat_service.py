
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

from app.db.session import get_chat_db, save_chat_db, get_message_db, save_message_db

def create_chat(user_id: str) -> str:
    """Create a new chat for a user."""
    chats_db = get_chat_db()
    
    chat = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "title": "New Chat",
        "created_at": datetime.utcnow().isoformat()
    }
    
    chats_db.append(chat)
    save_chat_db(chats_db)
    
    return chat["id"]

def get_chats(user_id: str) -> List[Dict[str, Any]]:
    """Get all chats for a user."""
    chats_db = get_chat_db()
    return [chat for chat in chats_db if chat["user_id"] == user_id]

def get_chat(chat_id: str) -> Optional[Dict[str, Any]]:
    """Get a chat by ID."""
    chats_db = get_chat_db()
    chat = next((chat for chat in chats_db if chat["id"] == chat_id), None)
    
    if chat:
        # Get messages for this chat
        messages_db = get_message_db()
        chat_messages = [msg for msg in messages_db if msg["chat_id"] == chat_id]
        chat["messages"] = sorted(chat_messages, key=lambda m: m["created_at"])
    
    return chat

def add_message(chat_id: str, role: str, content: str) -> str:
    """Add a message to a chat."""
    messages_db = get_message_db()
    
    message = {
        "id": str(uuid.uuid4()),
        "chat_id": chat_id,
        "role": role,
        "content": content,
        "created_at": datetime.utcnow().isoformat()
    }
    
    messages_db.append(message)
    save_message_db(messages_db)
    
    return message["id"]

def rename_chat(chat_id: str, title: str) -> bool:
    """Rename a chat."""
    chats_db = get_chat_db()
    
    for chat in chats_db:
        if chat["id"] == chat_id:
            chat["title"] = title
            save_chat_db(chats_db)
            return True
    
    return False

def delete_chat(chat_id: str) -> bool:
    """Delete a chat and its messages."""
    # Delete chat
    chats_db = get_chat_db()
    chats_db = [chat for chat in chats_db if chat["id"] != chat_id]
    save_chat_db(chats_db)
    
    # Delete messages
    messages_db = get_message_db()
    messages_db = [msg for msg in messages_db if msg["chat_id"] != chat_id]
    save_message_db(messages_db)
    
    return True
