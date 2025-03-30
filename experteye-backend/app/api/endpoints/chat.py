
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
import uuid
from datetime import datetime

from app.core.dependencies import get_current_user
from app.db.session import get_chat_db
from app.services.chat_service import create_chat, get_chats, add_message, get_chat
from app.rag.rag_engine import process_query

router = APIRouter()

@router.post("/")
async def create_new_chat(user: Dict[str, Any] = Depends(get_current_user)):
    chat_id = create_chat(user["id"])
    return {"chat_id": chat_id}

@router.get("/")
async def get_user_chats(user: Dict[str, Any] = Depends(get_current_user)):
    chats = get_chats(user["id"])
    return chats

@router.post("/{chat_id}/messages")
async def send_message(
    chat_id: str, 
    message: str,
    user: Dict[str, Any] = Depends(get_current_user)
):
    # Verify chat belongs to user
    chat = get_chat(chat_id)
    if not chat or chat["user_id"] != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    # Add user message to chat
    message_id = add_message(chat_id, "user", message)
    
    # Process query through RAG
    response = process_query(message)
    
    # Add assistant response
    assistant_message_id = add_message(chat_id, "assistant", response)
    
    return {
        "user_message_id": message_id,
        "assistant_message_id": assistant_message_id,
        "response": response
    }

@router.get("/{chat_id}")
async def get_chat_details(
    chat_id: str,
    user: Dict[str, Any] = Depends(get_current_user)
):
    chat = get_chat(chat_id)
    if not chat or chat["user_id"] != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    return chat
