
"""Persistent vector store implementation with change tracking"""
import os
import logging
import time
from typing import List, Dict, Set, Optional, Tuple, Any
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_community.vectorstores import FAISS

from app.rag.store_utils import save_json_safely, load_json_safely, create_backup
from app.rag.background_processor import BackgroundProcessor

logger = logging.getLogger("DocumentIntelligence.VectorStore")

class PersistentVectorStore:
    """Vector store that persists embeddings to disk and tracks document changes"""
    
    def __init__(
        self, 
        embeddings_model,
        storage_dir: str = ".vector_store",
        debug: bool = False
    ):
        self.embeddings = embeddings_model
        self.storage_dir = storage_dir
        self.debug = debug
        self.vector_store = None
        
        # File tracking
        self.document_hashes = {}
        self.processed_files = set()
        
        # Create storage directory
        os.makedirs(storage_dir, exist_ok=True)
        
        # File paths
        self.metadata_path = os.path.join(storage_dir, "metadata.json")
        self.vector_store_path = os.path.join(storage_dir, "vector_store.faiss")
        self.vector_store_pkl_path = os.path.join(storage_dir, "vector_store.pkl")
        self.chunk_tracking_path = os.path.join(storage_dir, "chunk_tracking.json")
        
        # Load existing data
        self.load_metadata()
        self.load_vector_store()
        
        # Initialize background processor
        self.background_processor = BackgroundProcessor(self)
    
    def add_documents_async(self, documents: List[Document]) -> bool:
        """Queue documents for background processing"""
        return self.background_processor.start_processing(documents)
    
    def get_processing_status(self) -> Dict[str, Any]:
        """Get status of background processing"""
        return self.background_processor.get_status()
    
    def is_processing(self) -> bool:
        """Check if background processing is active"""
        return self.background_processor.is_processing()
    
    def load_metadata(self) -> None:
        """Load metadata about processed files and their hashes"""
        metadata = load_json_safely(self.metadata_path)
        self.document_hashes = metadata.get('document_hashes', {})
        self.processed_files = set(metadata.get('processed_files', []))
        logger.info(f"Loaded metadata for {len(self.processed_files)} previously processed files")
    
    def save_metadata(self) -> None:
        """Save metadata about processed files and their hashes"""
        metadata = {
            'document_hashes': self.document_hashes,
            'processed_files': list(self.processed_files),
            'last_updated': time.time()
        }
        if save_json_safely(metadata, self.metadata_path):
            logger.info(f"Saved metadata for {len(self.processed_files)} processed files")
    
    def save_vector_store(self) -> None:
        """Save vector store to disk with backup"""
        if not self.vector_store:
            logger.warning("No vector store to save")
            return
        
        try:
            start_time = time.time()
            logger.info("Saving vector store to disk...")
            
            # Create backup
            backup_dir = os.path.join(self.storage_dir, "backups")
            if os.path.exists(self.vector_store_path):
                create_backup(self.vector_store_path, backup_dir)
                create_backup(self.vector_store_pkl_path, backup_dir)
            
            # Save to temporary files first
            temp_base = os.path.join(self.storage_dir, "vector_store.temp")
            self.vector_store.save_local(self.storage_dir, "vector_store.temp")
            
            # If successful, rename to final destination
            temp_faiss = f"{temp_base}.faiss"
            temp_pkl = f"{temp_base}.pkl"
            if os.path.exists(temp_faiss) and os.path.exists(temp_pkl):
                os.replace(temp_faiss, self.vector_store_path)
                os.replace(temp_pkl, self.vector_store_pkl_path)
            
            save_time = time.time() - start_time
            logger.info(f"Saved vector store in {save_time:.2f} seconds")
            
        except Exception as e:
            logger.error(f"Error saving vector store: {e}")
    
    def load_vector_store(self) -> bool:
        """Load existing vector store from disk"""
        if os.path.exists(self.vector_store_path) and os.path.exists(self.vector_store_pkl_path):
            try:
                start_time = time.time()
                logger.info("Loading vector store from disk...")
                
                self.vector_store = FAISS.load_local(
                    self.storage_dir,
                    self.embeddings,
                    "vector_store",
                    allow_dangerous_deserialization=True
                )
                
                load_time = time.time() - start_time
                logger.info(f"Loaded vector store in {load_time:.2f} seconds")
                return True
                
            except Exception as e:
                logger.error(f"Error loading vector store: {e}")
                self.vector_store = None
                return False
        
        logger.info("No existing vector store found")
        return False
    
    def similarity_search(self, query: str, k: int = 5) -> List[Document]:
        """Perform similarity search on the vector store"""
        if not self.vector_store:
            logger.warning("No vector store available for search")
            return []
        
        try:
            return self.vector_store.similarity_search(query, k=k)
        except Exception as e:
            logger.error(f"Error performing similarity search: {e}")
            return []
    
    def similarity_search_with_score(self, query: str, k: int = 5) -> List[Tuple[Document, float]]:
        """Perform similarity search on the vector store with scores"""
        if not self.vector_store:
            logger.warning("No vector store available for search")
            return []
        
        try:
            return self.vector_store.similarity_search_with_score(query, k=k)
        except Exception as e:
            logger.error(f"Error performing similarity search with score: {e}")
            return []
    
    def get_processed_files(self) -> Set[str]:
        """Get set of processed files"""
        return self.processed_files
    
    def full_content_search(self, query: str) -> List[str]:
        """Search through document hashes for matching filenames"""
        matching_files = []
        query_terms = [term.lower() for term in query.split() if len(term) > 2]
        
        for filename in self.processed_files:
            filename_lower = filename.lower()
            for term in query_terms:
                if term in filename_lower:
                    matching_files.append(filename)
                    break
        
        return matching_files

