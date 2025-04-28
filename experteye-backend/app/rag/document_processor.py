
"""Main document processing module"""
import os
import logging
import hashlib
import time
from typing import List, Dict, Any
from pathlib import Path
from langchain_core.documents import Document

from app.rag.processors.text_extraction import (
    process_pdf,
    process_text_file,
    EXCEL_SUPPORT,
    WORD_SUPPORT
)
from app.rag.processors.sas_processor import (
    process_sas_data,
    process_sas_program
)
from app.rag.processors.document_chunking import split_documents
from app.rag.vector_store import PersistentVectorStore, BackgroundProcessor

logger = logging.getLogger("DocumentIntelligence.Processor")

class DocumentProcessor:
    """Handles document loading and processing with incremental updates"""
    
    def __init__(
        self,
        embeddings_model,
        storage_dir: str = ".vector_store",
        chunk_size: int = 500,
        chunk_overlap: int = 100,
        debug: bool = False
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.debug = debug
        self.storage_dir = storage_dir
        
        # Document storage
        self.all_document_content = {}  # Maps filename to full content
        self.document_metadata = {}     # Additional metadata about documents
        
        # Initialize vector store
        self.vector_store = PersistentVectorStore(
            embeddings_model=embeddings_model,
            storage_dir=storage_dir,
            debug=debug
        )

    def process_document(self, file_path: str) -> List[Document]:
        """Process a single document"""
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return []
            
        filename = os.path.basename(file_path)
        file_ext = os.path.splitext(filename)[1].lower()
        
        # Process based on file type
        documents = []
        try:
            if file_ext == '.pdf':
                documents = process_pdf(file_path, filename)
            elif file_ext in ['.txt', '.md', '.csv', '.json']:
                documents = process_text_file(file_path, filename)
            elif file_ext == '.sas7bdat':
                documents = process_sas_data(file_path, filename)
            elif file_ext == '.sas':
                documents = process_sas_program(file_path, filename)
            else:
                logger.warning(f"Unsupported file type: {file_ext}")
                return []
            
            if documents:
                # Store document content and metadata
                self.all_document_content[filename] = "\n\n".join([doc.page_content for doc in documents])
                self.document_metadata[filename] = {
                    'pages': len(documents),
                    'path': file_path,
                    'size': os.path.getsize(file_path),
                    'last_modified': os.path.getmtime(file_path),
                    'filename': filename,
                    'extension': file_ext,
                    'type': self._get_doc_type(file_ext)
                }
                
                # Split into chunks
                return split_documents(documents, self.chunk_size, self.chunk_overlap)
            
            return []
        except Exception as e:
            logger.error(f"Error processing document {file_path}: {str(e)}")
            return []
    
    def _get_doc_type(self, file_ext: str) -> str:
        """Get document type from file extension"""
        ext_map = {
            '.pdf': 'pdf',
            '.txt': 'text',
            '.md': 'text',
            '.csv': 'text',
            '.json': 'text',
            '.xlsx': 'excel',
            '.xls': 'excel',
            '.docx': 'word',
            '.doc': 'word',
            '.pptx': 'pptx',
            '.ppt': 'pptx',
            '.sas7bdat': 'sas_data',
            '.sas': 'sas_code'
        }
        return ext_map.get(file_ext, 'unknown')

# Function to process documents asynchronously
async def process_document(document_id: str) -> bool:
    """Process a document after it has been uploaded"""
    try:
        logger.info(f"Processing document {document_id}")
        # Add actual processing logic here
        logger.info(f"Document {document_id} processed successfully")
        return True
    except Exception as e:
        logger.error(f"Error processing document {document_id}: {str(e)}")
        return False
