
import uuid
import os
import shutil
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import UploadFile

from app.db.session import get_document_db, save_document_db
from app.core.config import settings

async def save_document(file: UploadFile, user_id: str) -> str:
    """Save an uploaded document to disk and register in DB."""
    document_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    file_path = os.path.join(settings.DOCUMENTS_DIR, f"{document_id}{file_ext}")
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Save file to disk using chunks for large files
    with open(file_path, "wb") as buffer:
        # Read file in chunks to handle large files
        chunk_size = 1024 * 1024  # 1MB chunks
        while True:
            chunk = await file.read(chunk_size)
            if not chunk:
                break
            buffer.write(chunk)
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Register in database
    documents_db = get_document_db()
    
    document = {
        "id": document_id,
        "user_id": user_id,
        "filename": file.filename,
        "file_path": file_path,
        "file_size": file_size,
        "mime_type": file.content_type or "application/octet-stream",
        "created_at": datetime.utcnow().isoformat(),
        "processed": False,
        "processing_status": "pending"
    }
    
    documents_db.append(document)
    save_document_db(documents_db)
    
    return document_id

def list_documents(user_id: str) -> List[Dict[str, Any]]:
    """List all documents for a user."""
    documents_db = get_document_db()
    return [doc for doc in documents_db if doc["user_id"] == user_id]

def get_document(document_id: str) -> Optional[Dict[str, Any]]:
    """Get a document by ID."""
    documents_db = get_document_db()
    return next((doc for doc in documents_db if doc["id"] == document_id), None)

def delete_document(document_id: str) -> bool:
    """Delete a document."""
    documents_db = get_document_db()
    document = next((doc for doc in documents_db if doc["id"] == document_id), None)
    
    if not document:
        return False
    
    # Remove from disk if exists
    if os.path.exists(document["file_path"]):
        os.remove(document["file_path"])
    
    # Remove from database
    documents_db = [doc for doc in documents_db if doc["id"] != document_id]
    save_document_db(documents_db)
    
    return True

def update_document_status(document_id: str, status: str, processed: bool = None) -> bool:
    """Update document processing status."""
    documents_db = get_document_db()
    
    for doc in documents_db:
        if doc["id"] == document_id:
            doc["processing_status"] = status
            if processed is not None:
                doc["processed"] = processed
            save_document_db(documents_db)
            return True
    
    return False
