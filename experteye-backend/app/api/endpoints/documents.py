from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, BackgroundTasks
from typing import List, Dict, Any
import os
import uuid
from datetime import datetime
import asyncio

from app.core.dependencies import get_current_user
from app.services.document_service import save_document, list_documents, get_document, delete_document
from app.rag.processor_core import DocumentProcessor  # Using the updated import

router = APIRouter()

# Add the missing process_document function for background tasks
async def process_document(document_id: str):
    """Process document in the background"""
    try:
        # This function would typically call the document processor service
        # to extract text, create embeddings, and store in vector database
        print(f"Processing document {document_id} in background")
        # In a real implementation, this would use the DocumentProcessor
    except Exception as e:
        print(f"Error processing document {document_id}: {str(e)}")

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
