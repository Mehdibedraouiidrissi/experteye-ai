
"""Text extraction utilities for different file types"""
import os
import logging
import pytesseract
from typing import List
from langchain_core.documents import Document
from langchain_community.document_loaders import (
    PyMuPDFLoader, 
    PDFMinerLoader,
    TextLoader,
    UnstructuredExcelLoader,
    Docx2txtLoader,
    UnstructuredWordDocumentLoader,
    UnstructuredPowerPointLoader
)
from pdf2image import convert_from_path
from PIL import Image

logger = logging.getLogger("DocumentIntelligence.TextExtraction")

# Feature detection
try:
    import pandas as pd
    EXCEL_SUPPORT = True
except ImportError:
    EXCEL_SUPPORT = False

try:
    WORD_SUPPORT = True
except ImportError:
    WORD_SUPPORT = False

try:
    import pytesseract
    from pdf2image import convert_from_path
    from PIL import Image
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

def process_pdf(file_path: str, filename: str) -> List[Document]:
    """Extract text from PDF files with fallback to OCR"""
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return []
        
    try:
        # Use PyMuPDF for faster processing
        loader = PyMuPDFLoader(file_path)
        documents = loader.load()
        
        if not documents:
            # If PyMuPDF fails, try PDFMiner
            logger.info(f"PyMuPDF extracted no text from {filename}. Trying PDFMiner...")
            loader = PDFMinerLoader(file_path)
            documents = loader.load()
        
        if not documents and OCR_AVAILABLE:
            # If both fail and OCR is available, try OCR
            logger.info(f"Standard extraction failed for {filename}. Trying OCR...")
            documents = _process_with_ocr(file_path)
        
        if not documents:
            logger.error(f"Could not extract text from {filename}")
            return []
            
        # Enhance document metadata
        for i, doc in enumerate(documents):
            if not hasattr(doc, 'metadata'):
                doc.metadata = {}
            
            doc.metadata['source'] = filename
            if 'page' not in doc.metadata:
                doc.metadata['page'] = i + 1
            doc.metadata['doc_type'] = 'pdf'
            doc.metadata['extraction_method'] = 'pymupdf'
            doc.metadata['file_size'] = os.path.getsize(file_path)
            doc.metadata['last_modified'] = os.path.getmtime(file_path)
        
        logger.info(f"Successfully processed PDF: {filename} - extracted {len(documents)} pages")
        return documents
    except Exception as e:
        logger.error(f"Error processing PDF {file_path}: {str(e)}")
        return []

def process_text_file(file_path: str, filename: str) -> List[Document]:
    """Process text files (txt, md, etc)"""
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return []
        
    try:
        loader = TextLoader(file_path)
        documents = loader.load()
        
        if not documents:
            logger.error(f"Could not extract text from {filename}")
            return []
        
        # Add metadata
        for doc in documents:
            if not hasattr(doc, 'metadata'):
                doc.metadata = {}
            doc.metadata.update({
                'source': filename,
                'doc_type': 'text',
                'extraction_method': 'text_loader',
                'file_size': os.path.getsize(file_path),
                'last_modified': os.path.getmtime(file_path)
            })
        
        logger.info(f"Successfully processed text file: {filename}")
        return documents
    except Exception as e:
        logger.error(f"Error processing text file {file_path}: {str(e)}")
        return []

def _process_with_ocr(file_path: str) -> List[Document]:
    """Process PDF using OCR when text extraction fails"""
    try:
        # Convert PDF to images
        images = convert_from_path(file_path)
        documents = []
        
        for i, image in enumerate(images):
            # Extract text using OCR
            text = pytesseract.image_to_string(image)
            if text.strip():
                doc = Document(
                    page_content=text,
                    metadata={
                        'page': i + 1,
                        'extraction_method': 'ocr',
                        'doc_type': 'pdf'
                    }
                )
                documents.append(doc)
        
        return documents
    except Exception as e:
        logger.error(f"OCR processing failed: {str(e)}")
        return []
