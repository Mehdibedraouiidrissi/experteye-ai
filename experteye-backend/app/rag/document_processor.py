
import os
import uuid
import asyncio
import tempfile
from typing import List, Dict, Any, Tuple
import PyPDF2
import docx
import openpyxl
import fitz  # PyMuPDF
from pptx import Presentation

from app.db.session import get_document_db, save_document_db
from app.core.config import settings
from app.services.ollama_service import ollama_service
from app.rag.vector_store import vector_store

async def process_document(document_id: str) -> Dict[str, Any]:
    """
    Process a document for RAG indexing.
    Extract text, chunk it, create embeddings, and add to vector store.
    """
    # Get document from database
    documents = get_document_db()
    document = next((doc for doc in documents if doc["id"] == document_id), None)
    
    if not document:
        return {"success": False, "error": "Document not found"}
    
    # Update status to processing
    for doc in documents:
        if doc["id"] == document_id:
            doc["processing_status"] = "processing"
            break
    
    save_document_db(documents)
    
    try:
        # Extract text from document
        text = extract_text_from_document(document["file_path"])
        
        # Chunk the text
        chunks = chunk_text(text)
        
        # Generate embeddings for each chunk
        embeddings = []
        for chunk in chunks:
            embedding = await ollama_service.generate_embeddings(chunk)
            if embedding:
                embeddings.append(embedding)
        
        # Add to vector store
        if len(chunks) == len(embeddings) and len(chunks) > 0:
            vector_store.add_document(document_id, chunks, embeddings)
            
            # Update document status to completed
            for doc in documents:
                if doc["id"] == document_id:
                    doc["processed"] = True
                    doc["processing_status"] = "completed"
                    doc["chunk_count"] = len(chunks)
                    break
            
            save_document_db(documents)
            return {"success": True, "document_id": document_id, "status": "completed"}
        else:
            raise Exception("Embedding generation failed")
            
    except Exception as e:
        print(f"Error processing document: {str(e)}")
        
        # Update document status to error
        for doc in documents:
            if doc["id"] == document_id:
                doc["processing_status"] = "error"
                doc["error_message"] = str(e)
                break
        
        save_document_db(documents)
        return {"success": False, "error": str(e)}

def extract_text_from_document(file_path: str) -> str:
    """
    Extract text content from a document based on file type.
    Supports PDF, DOCX, XLSX, PPTX, and TXT files.
    """
    file_ext = os.path.splitext(file_path)[1].lower()
    
    try:
        if file_ext == ".pdf":
            return extract_text_from_pdf(file_path)
        elif file_ext == ".docx":
            return extract_text_from_docx(file_path)
        elif file_ext == ".xlsx":
            return extract_text_from_excel(file_path)
        elif file_ext == ".pptx":
            return extract_text_from_pptx(file_path)
        elif file_ext == ".txt":
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            return f"Unsupported file format: {file_ext}"
    except Exception as e:
        print(f"Error extracting text from {file_path}: {str(e)}")
        return f"Error extracting text: {str(e)}"

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF using PyMuPDF for better accuracy."""
    text = ""
    try:
        doc = fitz.open(file_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error with PyMuPDF: {str(e)}, trying PyPDF2...")
        # Fallback to PyPDF2
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text

def extract_text_from_docx(file_path: str) -> str:
    """Extract text from DOCX."""
    doc = docx.Document(file_path)
    return "\n".join([paragraph.text for paragraph in doc.paragraphs])

def extract_text_from_excel(file_path: str) -> str:
    """Extract text from Excel."""
    wb = openpyxl.load_workbook(file_path, data_only=True)
    text = []
    for sheet in wb.sheetnames:
        ws = wb[sheet]
        text.append(f"Sheet: {sheet}")
        for row in ws.iter_rows(values_only=True):
            text.append("\t".join([str(cell) if cell is not None else "" for cell in row]))
    return "\n".join(text)

def extract_text_from_pptx(file_path: str) -> str:
    """Extract text from PowerPoint."""
    prs = Presentation(file_path)
    text = []
    for i, slide in enumerate(prs.slides):
        text.append(f"Slide {i+1}")
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                text.append(shape.text)
    return "\n".join(text)

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
    """
    Split text into overlapping chunks of approximately chunk_size characters.
    """
    if not text:
        return []
        
    chunks = []
    start = 0
    text_len = len(text)
    
    while start < text_len:
        # Find the end of the chunk
        end = min(start + chunk_size, text_len)
        
        # If we're not at the end of the text, try to find a good break point
        if end < text_len:
            # Look for newline or period near the end of the chunk
            last_newline = text.rfind('\n', start, end)
            last_period = text.rfind('. ', start, end)
            
            # Choose the break point closest to the end
            break_point = max(last_newline, last_period)
            
            # If we found a good break point, use it
            if break_point > start:
                end = break_point + (2 if break_point == last_period else 1)  # Include the period and space or newline
        
        # Add the chunk to our list
        chunks.append(text[start:end].strip())
        
        # Move the start pointer, accounting for overlap
        start = max(start, end - overlap)
    
    return chunks
