
"""Background processing module for document embeddings"""
import logging
import threading
import queue
import time
from typing import List, Dict, Any, Optional
from langchain_core.documents import Document

logger = logging.getLogger("DocumentIntelligence.BackgroundProcessor")

class BackgroundProcessor:
    """Handles document processing in a background thread"""
    
    def __init__(self, vector_store):
        self.vector_store = vector_store
        self.processing_queue = queue.Queue()
        self.worker_thread = None
        self.running = False
        self.current_status = "idle"
        self.progress = {
            "processed": 0,
            "total": 0,
            "documents_processed": 0,
            "total_documents": 0,
            "current_batch": 0,
            "total_batches": 0
        }
        self.lock = threading.Lock()
    
    def start_processing(self, documents: List[Document]) -> bool:
        """Queue documents for processing in the background"""
        if self.is_processing():
            logger.warning("Processing already in progress, cannot start new job")
            return False

        with self.lock:
            unique_sources = set()
            for doc in documents:
                if hasattr(doc, 'metadata') and 'source' in doc.metadata:
                    unique_sources.add(doc.metadata['source'])
            
            self.progress = {
                "processed": 0,
                "total": len(documents),
                "documents_processed": 0,
                "total_documents": len(unique_sources),
                "current_batch": 0,
                "total_batches": 0
            }
            self.current_status = "starting"
        
        self.processing_queue.put(documents)
        
        if not self.running:
            self.running = True
            self.worker_thread = threading.Thread(target=self._worker_loop, daemon=True)
            self.worker_thread.start()
        
        return True
    
    def is_processing(self) -> bool:
        """Check if documents are currently being processed"""
        return not self.processing_queue.empty() or self.current_status == "processing"
    
    def get_status(self) -> Dict[str, Any]:
        """Get current processing status"""
        with self.lock:
            return {
                "status": self.current_status,
                "progress": self.progress.copy()
            }
    
    def _worker_loop(self) -> None:
        """Background thread that processes documents"""
        try:
            logger.info("Background processing thread started")
            
            while self.running:
                try:
                    try:
                        documents = self.processing_queue.get(timeout=1.0)
                    except queue.Empty:
                        if not self.running:
                            break
                        continue
                    
                    with self.lock:
                        self.current_status = "processing"
                    
                    self._process_documents(documents)
                    
                    with self.lock:
                        self.current_status = "idle"
                    
                    self.processing_queue.task_done()
                    
                except Exception as e:
                    logger.error(f"Error in background processing: {str(e)}")
                    logger.exception("Full traceback:")
                    with self.lock:
                        self.current_status = "error"
                    
                    if not self.processing_queue.empty():
                        self.processing_queue.task_done()
                    
        finally:
            logger.info("Background processing thread stopped")
            self.running = False
    
    def _process_documents(self, documents: List[Document]) -> None:
        """Process documents with improved progress tracking and error handling"""
        processed_document_sources = set()
        total_document_sources = set()
        
        try:
            for doc in documents:
                if hasattr(doc, 'metadata') and 'source' in doc.metadata:
                    total_document_sources.add(doc.metadata['source'])
            
            with self.lock:
                self.progress["total_documents"] = len(total_document_sources)
            
            # Process in batches with timeout protection
            batch_size = 50
            
            for batch_idx in range(0, len(documents), batch_size):
                if not self.running:
                    break
                
                end_idx = min(batch_idx + batch_size, len(documents))
                current_batch = documents[batch_idx:end_idx]
                
                try:
                    self.vector_store.add_documents(current_batch)
                    
                    # Update processed sources
                    for doc in current_batch:
                        if hasattr(doc, 'metadata') and 'source' in doc.metadata:
                            processed_document_sources.add(doc.metadata['source'])
                    
                    with self.lock:
                        self.progress["processed"] = end_idx
                        self.progress["documents_processed"] = len(processed_document_sources)
                    
                except Exception as e:
                    logger.error(f"Error processing batch: {str(e)}")
                    continue
            
            self.vector_store.save_vector_store()
            
            with self.lock:
                self.current_status = "completed"
                
        except Exception as e:
            logger.error(f"Error in document processing: {str(e)}")
            logger.exception("Full traceback:")
            with self.lock:
                self.current_status = "error"

