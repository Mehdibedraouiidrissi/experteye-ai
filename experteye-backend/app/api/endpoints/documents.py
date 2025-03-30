
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, BackgroundTasks
from typing import List, Dict, Any
import os
import uuid
from datetime import datetime
import asyncio

from app.core.dependencies import get_current_user
from app.services.document_service import save_document, list_documents, get_document, delete_document
from app.rag.document_processor import process_document

router = APIRouter()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    user: Dict[str, Any] = Depends(get_current_user)
):
    # Check file type
    allowed_extensions = [".pdf", ".docx", ".xlsx", ".pptx", ".txt", ".sas"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Check file size (limit to 100MB)
    try:
        # Get file size - FastAPI doesn't have direct file.size property
        # Instead, read a small chunk to confirm file exists, then check size
        content = await file.read(1024)  # Read first KB to validate file
        await file.seek(0)  # Reset file pointer to beginning
        
        # Get file size from file object if available
        file_size = getattr(file, "size", 0)
        
        # If size attribute not available, we'll rely on the backend's chunked processing
        if file_size > 100 * 1024 * 1024 and file_size != 0:  # 100 MB limit, if we can determine size
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File too large. Maximum size is 100MB."
            )
    except Exception as e:
        if not isinstance(e, HTTPException):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing file: {str(e)}"
            )
        else:
            raise e
    
    # Save document
    document_id = await save_document(file, user["id"])
    
    # Process document in background
    if background_tasks:
        background_tasks.add_task(process_document, document_id)
    else:
        # If background tasks aren't available, process synchronously
        asyncio.create_task(process_document(document_id))
    
    return {
        "document_id": document_id,
        "status": "processing",
        "message": "Document uploaded successfully and is being processed"
    }

@router.get("/")
async def get_user_documents(user: Dict[str, Any] = Depends(get_current_user)):
    documents = list_documents(user["id"])
    return documents

@router.get("/{document_id}")
async def get_document_details(
    document_id: str,
    user: Dict[str, Any] = Depends(get_current_user)
):
    document = get_document(document_id)
    if not document or document["user_id"] != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document

@router.delete("/{document_id}")
async def delete_user_document(
    document_id: str,
    user: Dict[str, Any] = Depends(get_current_user)
):
    document = get_document(document_id)
    if not document or document["user_id"] != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    success = delete_document(document_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete document"
        )
    
    return {"status": "success", "message": "Document deleted successfully"}
