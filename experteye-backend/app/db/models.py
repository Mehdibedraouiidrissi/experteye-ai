
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class User(BaseModel):
    id: str
    username: str
    email: str
    hashed_password: str
    plain_password: Optional[str] = None
    created_at: datetime
    
    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "username": "johndoe",
                "email": "john@example.com",
                "hashed_password": "[hashed_password]",
                "plain_password": "Password123",
                "created_at": "2023-01-01T00:00:00"
            }
        }

class Message(BaseModel):
    id: str
    chat_id: str
    role: str  # "user" or "assistant"
    content: str
    created_at: datetime
    
    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174001",
                "chat_id": "123e4567-e89b-12d3-a456-426614174002",
                "role": "user",
                "content": "Hello, how can I use this document?",
                "created_at": "2023-01-01T00:00:00"
            }
        }

class Chat(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime
    messages: List[Message] = []
    
    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174002",
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "New Conversation",
                "created_at": "2023-01-01T00:00:00",
                "messages": []
            }
        }

class Document(BaseModel):
    id: str
    user_id: str
    filename: str
    file_path: str
    file_size: int  # in bytes
    mime_type: str
    created_at: datetime
    processed: bool = False
    processing_status: str = "pending"  # pending, processing, completed, failed
    
    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174003",
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "filename": "document.pdf",
                "file_path": "/data/documents/123e4567-e89b-12d3-a456-426614174003.pdf",
                "file_size": 1048576,
                "mime_type": "application/pdf",
                "created_at": "2023-01-01T00:00:00",
                "processed": False,
                "processing_status": "pending"
            }
        }

