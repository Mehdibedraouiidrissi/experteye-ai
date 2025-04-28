# vector_store.py - Persistent vector store with change detection
import os
import pickle
import hashlib
import json
import time
import logging
from typing import List, Dict, Set, Optional, Tuple, Any
import threading
import queue
from typing import Optional
import streamlit as st
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_community.vectorstores import FAISS

logger = logging.getLogger("DocumentIntelligence.VectorStore")


class BackgroundProcessor:
    """Handles document processing in a background thread"""
    
    def __init__(self, vector_store):
        self.vector_store = vector_store
        self.processing_queue = queue.Queue()
        self.worker_thread = None
        self.running = False
        self.current_status = "idle"
        self.progress = {"processed": 0, "total": 0, "documents_processed" : 0 , "total_documents" : 0 , "current_batch": 0, "total_batches": 0}
        self.lock = threading.Lock()
    
    def start_processing(self, documents: List[Document]) -> bool:
        """Queue documents for processing in the background"""
        if self.is_processing():
            logger.warning("Processing already in progress, cannot start new job")
            return False

        document_sources = set()
        for doc in documents:
            if hasattr(doc, 'metadata') and 'source' in doc.metadata:
                document_sources.add(doc.metadata['source'])

        with self.lock:
            # Get document count from the provided list
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
        
        # Add to queue
        self.processing_queue.put(documents)
        
        # Start worker thread if not running
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
            status = {
                "status": self.current_status,
                "progress": self.progress.copy()
            }
        return status
    
    def _worker_loop(self) -> None:
        """Background thread that processes documents"""
        try:
            logger.info("Background processing thread started")
            
            while self.running:
                try:
                    # Get documents from queue with timeout
                    try:
                        documents = self.processing_queue.get(timeout=1.0)
                    except queue.Empty:
                        # No documents to process, check if we should keep running
                        if not self.running:
                            break
                        continue
                    
                    # Process documents
                    with self.lock:
                        self.current_status = "processing"
                    
                    # Process documents with progress updates
                    self._process_documents(documents)
                    
                    # Mark as completed
                    with self.lock:
                        self.current_status = "idle"
                    
                    # Mark queue task as done
                    self.processing_queue.task_done()
                    
                except Exception as e:
                    logger.error(f"Error in background processing: {str(e)}")
                    logger.exception("Full traceback:")
                    with self.lock:
                        self.current_status = "error"
                    
                    # Still mark task as done to prevent queue blockage
                    if not self.processing_queue.empty():
                        self.processing_queue.task_done()
        finally:
            logger.info("Background processing thread stopped")
            self.running = False
    
    def _process_documents(self, documents: List[Document]) -> None:
        """Process documents with improved progress tracking and error handling"""
        # Initialize a set to track processed document sources
        processed_document_sources = set()
        total_document_sources = set()
        
        try:
            # Identify all unique document sources
            for doc in documents:
                if hasattr(doc, 'metadata') and 'source' in doc.metadata:
                    total_document_sources.add(doc.metadata['source'])
            
            # Update total document count immediately
            with self.lock:
                self.progress["total_documents"] = len(total_document_sources)
            
            # Load existing tracking with error handling
            try:
                chunk_tracking = self.vector_store._load_chunk_tracking()
            except Exception as e:
                logger.error(f"Error loading chunk tracking: {str(e)}")
                chunk_tracking = {}
            
            # Prepare documents for processing
            documents_to_process = []
            chunk_ids_to_process = []
            
            # Group documents by source filename
            documents_by_source = {}
            for i, doc in enumerate(documents):
                source = doc.metadata.get('source', f'unknown_{i}') if hasattr(doc, 'metadata') else f'unknown_{i}'
                if source not in documents_by_source:
                    documents_by_source[source] = []
                documents_by_source[source].append((i, doc))
            
            # Update total document count
            with self.lock:
                self.progress["total_documents"] = len(documents_by_source)
            
            # Process documents by source file
            skipped_count = 0
            
            for source, docs_with_index in documents_by_source.items():
                # Get chunk IDs for this source
                source_chunk_ids = set(chunk_tracking.get(source, []))
                
                # Filter out already processed chunks
                for idx, doc in docs_with_index:
                    try:
                        # Create a unique chunk identifier (source + content hash)
                        content_hash = hashlib.md5(doc.page_content[:100].encode()).hexdigest()[:10]
                        chunk_id = f"{source}_{content_hash}"
                        
                        if chunk_id in source_chunk_ids:
                            skipped_count += 1
                            continue
                        
                        # Add to processing list with chunk ID
                        documents_to_process.append(doc)
                        chunk_ids_to_process.append(chunk_id)
                    except Exception as e:
                        logger.error(f"Error preparing document for processing: {str(e)}")
                        continue
            
            # Update total count
            with self.lock:
                self.progress["total"] = len(documents_to_process)
                self.progress["skipped"] = skipped_count
            
            # If nothing to process, we're done
            if not documents_to_process:
                with self.lock:
                    self.current_status = "completed"
                    self.progress["processed"] = 0
                    self.progress["total"] = 0
                    self.progress["documents_processed"] = len(documents_by_source)
                    self.progress["total_documents"] = len(documents_by_source)
                return
            
            # Process in batches with timeout protection
            batch_size = 50
            total_batches = (len(documents_to_process) + batch_size - 1) // batch_size
            
            with self.lock:
                self.progress["total_batches"] = total_batches
            
            # Track processing start time for timeout detection
            processing_start_time = time.time()
            max_processing_time = 3600  # 1 hour maximum processing time
            
            for batch_idx in range(0, len(documents_to_process), batch_size):
                # Check if processing was interrupted
                if not self.running:
                    break
                    
                # Check for timeout
                if time.time() - processing_start_time > max_processing_time:
                    logger.warning(f"Maximum processing time reached. Stopping after {batch_idx // batch_size} batches.")
                    break
                    
                # Update batch progress
                with self.lock:
                    self.progress["current_batch"] = batch_idx // batch_size + 1
                
                # Process batch
                end_idx = min(batch_idx + batch_size, len(documents_to_process))
                current_batch = documents_to_process[batch_idx:end_idx]
                current_chunk_ids = chunk_ids_to_process[batch_idx:end_idx]
                
                # Track document sources in this batch
                batch_sources = set()
                for doc in current_batch:
                    if hasattr(doc, 'metadata') and 'source' in doc.metadata:
                        batch_sources.add(doc.metadata['source'])
                
                with self.lock:
                    self.progress["documents_processed"] = len(processed_document_sources)
                
                # Log progress for debugging
                logger.info(f"Documents processed: {len(processed_document_sources)}/{len(total_document_sources)}")
                
                try:
                    # Ensure vector store exists
                    if self.vector_store.vector_store is None:
                        # Initialize with first 10 docs
                        init_size = min(10, len(current_batch))
                        init_docs = current_batch[:init_size]
                        init_chunk_ids = current_chunk_ids[:init_size]
                        
                        # Create vector store with timeout protection
                        try:
                            import signal
                            
                            def timeout_handler(signum, frame):
                                raise TimeoutError("Vector store initialization timed out")
                            
                            # Set timeout (30 seconds)
                            signal.signal(signal.SIGALRM, timeout_handler)
                            signal.alarm(30)
                            
                            self.vector_store.vector_store = FAISS.from_documents(
                                init_docs, 
                                self.vector_store.embeddings
                            )
                            
                            # Cancel timeout
                            signal.alarm(0)
                            
                            # Update tracking for initialized documents
                            self.vector_store._update_chunk_tracking(init_docs, init_chunk_ids)
                            
                        except TimeoutError as e:
                            logger.error(f"Timeout during vector store initialization: {str(e)}")
                            with self.lock:
                                self.current_status = "error"
                            return
                        except Exception as e:
                            logger.error(f"Error initializing vector store: {str(e)}")
                            with self.lock:
                                self.current_status = "error"
                            return
                        
                        # Continue with remaining documents
                        current_batch = current_batch[init_size:]
                        current_chunk_ids = current_chunk_ids[init_size:]
                    
                    # Add remaining documents with batch-level error handling
                    if current_batch:
                        try:
                            self.vector_store.vector_store.add_documents(current_batch)
                            self.vector_store._update_chunk_tracking(current_batch, current_chunk_ids)
                        except Exception as e:
                            logger.error(f"Error adding documents to vector store: {str(e)}")
                            # Continue with next batch despite error
                    
                    # Update processed document sources
                    for source in batch_sources:
                        processed_document_sources.add(source)
                    
                    # Update documents processed count
                    with self.lock:
                        self.progress["documents_processed"] = len(processed_document_sources)
                    
                except Exception as e:
                    logger.error(f"Error processing batch {batch_idx//batch_size+1}: {str(e)}")
                    continue
                
                # Update processed count
                processed_so_far = min(batch_idx + batch_size, len(documents_to_process))
                with self.lock:
                    self.progress["processed"] = processed_so_far
                
                # Save checkpoint periodically
                if (batch_idx // batch_size) % 5 == 0:
                    try:
                        self.vector_store._save_chunk_tracking()
                        self.vector_store.save_vector_store()
                    except Exception as e:
                        logger.error(f"Error saving checkpoint: {str(e)}")
            
            # Final save
            try:
                self.vector_store.save_vector_store()
                self.vector_store.save_metadata()
                self.vector_store._save_chunk_tracking()
            except Exception as e:
                logger.error(f"Error in final save: {str(e)}")
            
            # Update status
            with self.lock:
                self.current_status = "completed"
        
        except Exception as e:
            logger.error(f"Error in background processing: {str(e)}")
            logger.exception("Full traceback:")
            with self.lock:
                self.current_status = "error"



class PersistentVectorStore:
    """Vector store that persists embeddings to disk and tracks document changes"""
    
    def __init__(
        self, 
        embeddings_model,
        storage_dir: str = ".vector_store",
        debug: bool = False
    ):
        self.embeddings = embeddings_model  # Store the embeddings model directly
        self.storage_dir = storage_dir
        self.debug = debug
        self.vector_store = None
        
        # File tracking
        self.document_hashes = {}  # Maps filename to hash
        self.processed_files = set()
        
        # Create storage directory if it doesn't exist
        os.makedirs(storage_dir, exist_ok=True)
        
        # Metadata file paths
        self.metadata_path = os.path.join(storage_dir, "metadata.json")
        self.vector_store_path = os.path.join(storage_dir, "vector_store.faiss")
        self.vector_store_pkl_path = os.path.join(storage_dir, "vector_store.pkl")
        
        # Load existing metadata if available
        self.load_metadata()
        
        # Load existing vector store if available
        self.load_vector_store()

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
        if os.path.exists(self.metadata_path):
            try:
                with open(self.metadata_path, 'r') as f:
                    metadata = json.load(f)
                    self.document_hashes = metadata.get('document_hashes', {})
                    self.processed_files = set(metadata.get('processed_files', []))
                    
                logger.info(f"Loaded metadata for {len(self.processed_files)} previously processed files")
                if self.debug:
                    logger.info(f"Loaded metadata for {len(self.processed_files)} previously processed files")
            except Exception as e:
                logger.error(f"Error loading metadata: {e}")
                if self.debug:
                    st.sidebar.error(f"Error loading metadata: {e}")
    
    def save_metadata(self) -> None:
        """Save metadata about processed files and their hashes"""
        try:
            metadata = {
                'document_hashes': self.document_hashes,
                'processed_files': list(self.processed_files),
                'last_updated': time.time()
            }
            
            with open(self.metadata_path, 'w') as f:
                json.dump(metadata, f)
                
            logger.info(f"Saved metadata for {len(self.processed_files)} processed files")
        except Exception as e:
            logger.error(f"Error saving metadata: {e}")
            if self.debug:
                st.error(f"Error saving metadata: {e}")
            
    def save_vector_store(self) -> None:
        """Save vector store to disk with backup"""
        if not self.vector_store:
            logger.warning("No vector store to save")
            return
        
        try:
            start_time = time.time()
            logger.info("Saving vector store to disk...")
            
            # Create backup of existing files if they exist
            if os.path.exists(self.vector_store_path) and os.path.exists(self.vector_store_pkl_path):
                try:
                    import shutil
                    backup_dir = os.path.join(self.storage_dir, "backups")
                    os.makedirs(backup_dir, exist_ok=True)
                    
                    # Use timestamp for backup
                    timestamp = int(time.time())
                    
                    # Backup FAISS index
                    shutil.copy2(
                        self.vector_store_path, 
                        os.path.join(backup_dir, f"vector_store_{timestamp}.faiss")
                    )
                    
                    # Backup pickle file
                    shutil.copy2(
                        self.vector_store_pkl_path, 
                        os.path.join(backup_dir, f"vector_store_{timestamp}.pkl")
                    )
                    
                    # Keep only last 5 backups
                    backups = sorted([f for f in os.listdir(backup_dir) if f.endswith('.faiss')])
                    if len(backups) > 5:
                        for old_backup in backups[:-5]:
                            os.remove(os.path.join(backup_dir, old_backup))
                            pkl_backup = old_backup.replace('.faiss', '.pkl')
                            if os.path.exists(os.path.join(backup_dir, pkl_backup)):
                                os.remove(os.path.join(backup_dir, pkl_backup))
                                
                    logger.info(f"Created backup of vector store")
                except Exception as e:
                    logger.warning(f"Failed to create backup: {e}")
            
            # Save to temporary files first
            temp_base = os.path.join(self.storage_dir, "vector_store.temp")
            temp_faiss = f"{temp_base}.faiss"
            temp_pkl = f"{temp_base}.pkl"
            
            # Save to temp location
            self.vector_store.save_local(self.storage_dir, "vector_store.temp")
            
            # If successful, rename to final destination
            if os.path.exists(temp_faiss) and os.path.exists(temp_pkl):
                os.replace(temp_faiss, self.vector_store_path)
                os.replace(temp_pkl, self.vector_store_pkl_path)
                
            save_time = time.time() - start_time
            logger.info(f"Saved vector store in {save_time:.2f} seconds")
            
            if self.debug:
                logger.info(f"Saved vector store ({save_time:.2f}s)")
        except Exception as e:
            logger.error(f"Error saving vector store: {e}")
            if self.debug:
                st.error(f"Error saving vector store: {e}")    

    def load_vector_store(self) -> bool:
        """Load existing vector store from disk with improved error handling and backup recovery"""
        if os.path.exists(self.vector_store_path) and os.path.exists(self.vector_store_pkl_path):
            try:
                start_time = time.time()
                logger.info("Loading vector store from disk...")
                
                # Update to include allow_dangerous_deserialization
                self.vector_store = FAISS.load_local(
                    self.storage_dir,
                    self.embeddings,
                    "vector_store",
                    allow_dangerous_deserialization=True
                )
                
                load_time = time.time() - start_time
                logger.info(f"Loaded vector store in {load_time:.2f} seconds")
                
                # Only show in sidebar if explicitly debugging
                if self.debug and st.session_state.get('show_debug_info', False):
                    logger.info(f"Loaded existing vector store ({load_time:.2f}s)")
                return True
            except Exception as e:
                logger.error(f"Error loading vector store: {e}")
                if self.debug:
                    st.error(f"Error loading vector store: {e}")
                
                # Try to recover from backup
                try:
                    backup_dir = os.path.join(self.storage_dir, "backups")
                    if os.path.exists(backup_dir):
                        backups = sorted([f for f in os.listdir(backup_dir) if f.endswith('.faiss')])
                        if backups:
                            latest_backup = backups[-1]
                            backup_name = latest_backup.split('.')[0]  # Get name without extension
                            
                            logger.info(f"Attempting to restore from backup: {backup_name}")
                            
                            # Copy backup files to main location
                            import shutil
                            shutil.copy2(
                                os.path.join(backup_dir, f"{backup_name}.faiss"),
                                self.vector_store_path
                            )
                            shutil.copy2(
                                os.path.join(backup_dir, f"{backup_name}.pkl"),
                                self.vector_store_pkl_path
                            )
                            
                            # Retry loading
                            self.vector_store = FAISS.load_local(
                                self.storage_dir,
                                self.embeddings,
                                "vector_store",
                                allow_dangerous_deserialization=True
                            )
                            
                            logger.info(f"Successfully restored from backup: {backup_name}")
                            if self.debug:
                                logger.info(f"Restored from backup: {backup_name}")
                            return True
                except Exception as backup_e:
                    logger.error(f"Failed to restore from backup: {backup_e}")
                
                self.vector_store = None
                return False
        else:
            logger.info("No existing vector store found")
            return False

    def compute_file_hash(self, file_path: str) -> str:
        """Compute hash of file to detect changes"""
        try:
            # Get file stats for quick comparison
            stats = os.stat(file_path)
            file_size = stats.st_size
            modified_time = stats.st_mtime
            
            # For simplicity, use size + mtime as the hash for now
            # This avoids reading large files, but you could use a true hash if needed
            hash_input = f"{file_path}_{file_size}_{modified_time}"
            return hashlib.md5(hash_input.encode()).hexdigest()
        except Exception as e:
            logger.error(f"Error computing hash for {file_path}: {e}")
            # Return a random hash to force reprocessing
            return hashlib.md5(os.urandom(16)).hexdigest()
    
    def file_needs_processing(self, file_path: str) -> bool:
        """Check if a file needs processing (new or changed)"""
        filename = os.path.basename(file_path)
        
        # Get current file hash
        current_hash = self.compute_file_hash(file_path)
        
        # Check if file is new or changed
        if filename not in self.document_hashes or self.document_hashes[filename] != current_hash:
            return True
        
        # File exists and hasn't changed
        return False
    
    def mark_file_processed(self, file_path: str) -> None:
        """Mark a file as processed with its current hash"""
        filename = os.path.basename(file_path)
        self.document_hashes[filename] = self.compute_file_hash(file_path)
        self.processed_files.add(filename)
                      
    def similarity_search(self, query: str, k: int = 5) -> List[Document]:
        """Perform similarity search on the vector store"""
        if not self.vector_store:
            logger.warning("No vector store available for search")
            return []
        
        try:
            results = self.vector_store.similarity_search(query, k=k)
            return results
        except Exception as e:
            logger.error(f"Error performing similarity search: {e}")
            if self.debug:
                st.error(f"Error performing similarity search: {e}")
            return []
    
    def similarity_search_with_score(self, query: str, k: int = 5) -> List[Tuple[Document, float]]:
        """Perform similarity search on the vector store with scores"""
        if not self.vector_store:
            logger.warning("No vector store available for search")
            return []
        
        try:
            results = self.vector_store.similarity_search_with_score(query, k=k)
            return results
        except Exception as e:
            logger.error(f"Error performing similarity search with score: {e}")
            if self.debug:
                st.error(f"Error performing similarity search with score: {e}")
            return []
    
    def get_processed_files(self) -> Set[str]:
        """Get set of processed files"""
        return self.processed_files
    
    def full_content_search(self, query: str) -> List[str]:
        """Search through document hashes for matching filenames"""
        matching_files = []
        
        # Normalize query terms
        query_terms = [term.lower() for term in query.split() if len(term) > 2]
        
        # Check each filename
        for filename in self.processed_files:
            filename_lower = filename.lower()
            
            # Check if any query term appears in the filename
            for term in query_terms:
                if term in filename_lower:
                    matching_files.append(filename)
                    break
        
        return matching_files

    def add_documents(self, documents: List[Document]) -> bool:
        """Add documents to the vector store with robust chunk-level tracking"""
        if not documents:
            logger.warning("No documents to add")
            return False
        
        try:
            total_docs = len(documents)
            logger.info(f"Starting to process {total_docs} documents for embeddings")
            timestartvector = time.time()

            # Load existing processing state
            chunk_tracking = self._load_chunk_tracking()
            
            # Group documents by source filename
            documents_by_source = {}
            for i, doc in enumerate(documents):
                source = doc.metadata.get('source', f'unknown_{i}') if hasattr(doc, 'metadata') else f'unknown_{i}'
                if source not in documents_by_source:
                    documents_by_source[source] = []
                documents_by_source[source].append((i, doc))  # Store original index with doc
            
            # Process documents by source file
            documents_to_process = []
            chunk_ids_to_process = []
            skipped_count = 0
            
            for source, docs_with_index in documents_by_source.items():
                # Get chunk IDs for this source
                source_chunk_ids = set(chunk_tracking.get(source, []))
                
                # Filter out already processed chunks
                for idx, doc in docs_with_index:
                    # Create a unique chunk identifier (source + content hash)
                    content_hash = hashlib.md5(doc.page_content[:100].encode()).hexdigest()[:10]
                    chunk_id = f"{source}_{content_hash}"
                    
                    if chunk_id in source_chunk_ids:
                        skipped_count += 1
                        continue
                    
                    # Add to processing list with chunk ID
                    documents_to_process.append((idx, doc))
                    chunk_ids_to_process.append(chunk_id)
            
            if skipped_count > 0:
                logger.info(f"Skipping {skipped_count} already processed chunks")
            
            # If all chunks are processed, we're done
            if not documents_to_process:
                logger.info("All chunks already processed")
                return True
                
            # Sort by original index to maintain order
            documents_to_process.sort(key=lambda x: x[0])
            docs_to_process = [doc for _, doc in documents_to_process]
            
            logger.info(f"Processing {len(docs_to_process)} new or changed chunks")
            
            # Create a new vector store if it doesn't exist
            if self.vector_store is None:
                logger.info("Vector store doesn't exist, creating new one")
                # Take first 10 documents for initialization
                init_docs = docs_to_process[:min(10, len(docs_to_process))]
                logger.info(f"Initializing with first {len(init_docs)} documents")
                
                # Get embeddings manually to see the process
                texts = [doc.page_content for doc in init_docs]
                logger.info(f"Getting embeddings for {len(texts)} documents")
                embeddings_list = self.embeddings.embed_documents(texts)
                logger.info(f"Created {len(embeddings_list)} embeddings for initialization")
                
                # Create FAISS index
                self.vector_store = FAISS.from_documents(init_docs, self.embeddings)
                logger.info("Successfully created vector store")
                
                # Update tracking for initialized documents
                init_chunk_ids = chunk_ids_to_process[:len(init_docs)]
                self._update_chunk_tracking(init_docs, init_chunk_ids)
                
                # Continue with remaining documents
                docs_to_process = docs_to_process[len(init_docs):]
                chunk_ids_to_process = chunk_ids_to_process[len(init_docs):]
                
                if not docs_to_process:
                    logger.info("No more documents to process")
                    self.save_vector_store()
                    self.save_metadata()
                    self._save_chunk_tracking()
                    return True
            
            # Process in small fixed-size batches with adaptive sizing
            batch_size = 100  # Start with default
            total_batches = (len(docs_to_process) + batch_size - 1) // batch_size
            
            # Track embedding times to detect slowdowns
            recent_times = []
            
            for batch_idx in range(0, len(docs_to_process), batch_size):
                batch_start = time.time()
                end_idx = min(batch_idx + batch_size, len(docs_to_process))
                current_batch = docs_to_process[batch_idx:end_idx]
                current_chunk_ids = chunk_ids_to_process[batch_idx:end_idx]
                batch_num = batch_idx // batch_size + 1
                
                logger.info(f"BATCH {batch_num}/{total_batches}: Processing documents {batch_idx+1}-{end_idx} of {len(docs_to_process)}")
                
                # Get document texts
                texts = [doc.page_content for doc in current_batch]
                logger.info(f"BATCH {batch_num}: Starting embeddings generation for {len(texts)} texts")
                
                # Try to process in even smaller groups to see progress
                sub_size = 10
                all_embeddings = []
                
                # Track sub-batch times to detect issues
                sub_batch_times = []
                
                for sub_idx in range(0, len(texts), sub_size):
                    sub_end = min(sub_idx + sub_size, len(texts))
                    sub_texts = texts[sub_idx:sub_end]
                    logger.info(f"BATCH {batch_num}: Sub-batch {sub_idx//sub_size+1}: Processing texts {sub_idx+1}-{sub_end}")
                    
                    sub_start = time.time()
                    try:
                        sub_embeddings = self.embeddings.embed_documents(sub_texts)
                        all_embeddings.extend(sub_embeddings)
                        sub_time = time.time() - sub_start
                        sub_batch_times.append(sub_time)
                        logger.info(f"BATCH {batch_num}: Sub-batch {sub_idx//sub_size+1}: Completed in {sub_time:.2f}s")
                        
                        # Check for slow processing and reduce batch size if needed
                        if len(sub_batch_times) >= 3:
                            avg_time = sum(sub_batch_times[-3:]) / 3
                            if avg_time > 45:  # If average time is over 45 seconds
                                logger.warning(f"Embeddings taking too long (avg: {avg_time:.2f}s), consider reducing batch size")
                                
                        # Update chunk tracking after each sub-batch for better recovery
                        sub_batch_docs = current_batch[sub_idx:sub_end]
                        sub_batch_ids = current_chunk_ids[sub_idx:sub_end]
                        self._update_chunk_tracking(sub_batch_docs, sub_batch_ids)
                        
                    except Exception as e:
                        logger.error(f"Error in sub-batch embedding: {e}")
                        # Continue with next sub-batch
                
                # Now add to vector store
                batch_add_start = time.time()
                logger.info(f"BATCH {batch_num}: Adding documents to vector store")
                
                try:
                    self.vector_store.add_documents(current_batch)
                    
                    # Update tracking after batch completes
                    self._update_chunk_tracking(current_batch, current_chunk_ids)
                    
                    batch_time = time.time() - batch_start
                    logger.info(f"BATCH {batch_num}: Completed in {batch_time:.2f}s")
                    
                    # Track batch times
                    recent_times.append(batch_time)
                    if len(recent_times) > 3:
                        recent_times.pop(0)
                    
                    # Detect slowdowns and adjust batch size
                    if len(recent_times) >= 3 and recent_times[-1] > recent_times[0] * 1.5:
                        old_batch_size = batch_size
                        batch_size = max(20, batch_size // 2)
                        logger.warning(f"Processing slowing down. Reducing batch size from {old_batch_size} to {batch_size}")
                    
                    # Save checkpoint every 5 batches
                    if batch_num % 5 == 0:
                        logger.info(f"Saving checkpoint after batch {batch_num}")
                        self._save_chunk_tracking()
                        self.save_vector_store()
                        
                except Exception as e:
                    logger.error(f"Error adding batch {batch_num} to vector store: {e}")
                    # Continue with next batch
            
            # Final save
            self.save_vector_store()
            self.save_metadata()
            self._save_chunk_tracking()
            
            vectorsavetime = time.time() - timestartvector
            hours = int(vectorsavetime // 3600)
            minutes = int((vectorsavetime % 3600) // 60)
            seconds = int(vectorsavetime % 60)
            logger.info(f"Successfully added all {total_docs} documents to vector store in {hours}h {minutes}m {seconds}s")
            return True
            
        except Exception as e:
            logger.error(f"Error adding documents to vector store: {str(e)}")
            logger.exception("Full traceback:")
            if self.debug:
                st.error(f"Error adding documents to vector store: {str(e)}")
            return False

    def _load_chunk_tracking(self) -> Dict[str, List[str]]:
        """Load information about which chunks have been processed by source file"""
        chunk_track_path = os.path.join(self.storage_dir, "chunk_tracking.json")
        if os.path.exists(chunk_track_path):
            try:
                with open(chunk_track_path, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading chunk tracking: {e}")
        return {}

    def _update_chunk_tracking(self, batch_docs: List[Document], chunk_ids: List[str]) -> None:
        """Update tracking information for processed chunks"""
        tracking = self._load_chunk_tracking()
        
        for doc, chunk_id in zip(batch_docs, chunk_ids):
            source = doc.metadata.get('source', 'unknown') if hasattr(doc, 'metadata') else 'unknown'
            if source not in tracking:
                tracking[source] = []
            if chunk_id not in tracking[source]:
                tracking[source].append(chunk_id)
        
        # Save to temporary file first
        chunk_track_path = os.path.join(self.storage_dir, "chunk_tracking.json")
        temp_path = chunk_track_path + ".tmp"
        
        try:
            with open(temp_path, 'w') as f:
                json.dump(tracking, f)
            # Then safely replace the original
            os.replace(temp_path, chunk_track_path)
        except Exception as e:
            logger.error(f"Error saving chunk tracking: {e}")
            
    def _save_chunk_tracking(self) -> None:
        """Save chunk tracking information to disk"""
        tracking = self._load_chunk_tracking()
        
        # Calculate statistics
        total_chunks = sum(len(chunks) for chunks in tracking.values())
        total_sources = len(tracking)
        
        logger.info(f"Saving progress: {total_chunks} chunks processed across {total_sources} source files")
        
        # Save tracking data
        chunk_track_path = os.path.join(self.storage_dir, "chunk_tracking.json")
        temp_path = chunk_track_path + ".tmp"
        
        try:
            with open(temp_path, 'w') as f:
                json.dump(tracking, f)
            # Then safely replace the original
            os.replace(temp_path, chunk_track_path)
        except Exception as e:
            logger.error(f"Error saving chunk tracking: {e}")