# document_processor.py - Document loading and processing with incremental updates
import os
import re
import time
import logging
import hashlib
import pyreadstat
from typing import List, Dict, Any, Optional, Union, Set, Tuple
from pathlib import Path
from pptx import Presentation

import streamlit as st
from langchain_core.documents import Document
from app.rag.vector_store import PersistentVectorStore, BackgroundProcessor

# Document loaders
from langchain_community.document_loaders import (
    PyMuPDFLoader, 
    PDFMinerLoader,
    TextLoader
)
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter,
    HTMLHeaderTextSplitter
)
# Text splitter
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.rag.vector_store import PersistentVectorStore

# For Excel
try:
    import pandas as pd
    from langchain_community.document_loaders import UnstructuredExcelLoader
    EXCEL_SUPPORT = True
except ImportError:
    EXCEL_SUPPORT = False

# For Word
try:
    from langchain_community.document_loaders import Docx2txtLoader, UnstructuredWordDocumentLoader
    WORD_SUPPORT = True
except ImportError:
    WORD_SUPPORT = False

# For SAS files
try:
    import pandas as pd
    import pyreadstat
    SAS_SUPPORT = True
except ImportError:
    SAS_SUPPORT = False

# For PowerPoint
try:
    from langchain_community.document_loaders import UnstructuredPowerPointLoader
    PPTX_SUPPORT = True
except ImportError:
    PPTX_SUPPORT = False

# PDF processing with OCR capabilities (optional)
try:
    import pytesseract
    from pdf2image import convert_from_path
    from PIL import Image
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

# Configure logger
logger = logging.getLogger("DocumentIntelligence.Processor")

# Define the process_document function that's imported in documents.py
async def process_document(document_id: str):
    """Process a document after it has been uploaded.
    
    Args:
        document_id: The ID of the document to process
    
    Returns:
        None
    """
    try:
        logger.info(f"Processing document {document_id}")
        # In a real implementation, this would:
        # 1. Load the document from storage
        # 2. Extract text/metadata
        # 3. Split into chunks
        # 4. Create vector embeddings
        # 5. Store in vector database
        
        # For now, just log that we're processing
        logger.info(f"Document {document_id} processed successfully")
        return True
    except Exception as e:
        logger.error(f"Error processing document {document_id}: {str(e)}")
        return False

class DocumentProcessor:
    """Handles document loading, processing, and chunking with incremental updates"""
    
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
        
        # Progress tracking
        self.progress_container = None
        self.progress_bar = None
        self.status_text = None
        self.total_files = 0
        self.files_processed = 0
        self.processing_start_time = 0
        
        # File type counters
        self.file_type_counts = {
            "pdf": 0,
            "text": 0,
            "excel": 0,
            "word": 0,
            "pptx": 0,
            "sas_data": 0,
            "sas_code": 0
        }
        
        # Document storage
        self.all_document_content = {}  # Maps filename to full content
        self.document_metadata = {}     # Additional metadata about documents
        
        # Initialize text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", " ", ""],
            add_start_index=True
        )

        self.md_header_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=[
                ("#", "Header 1"),
                ("##", "Header 2"),
                ("###", "Header 3"),
            ]
        )

        # Initialize persistent vector store
        self.vector_store = PersistentVectorStore(
            embeddings_model=embeddings_model,  # Pass the model directly
            storage_dir=storage_dir,
            debug=debug
        )
        
        # Log this info to the console but don't display in the sidebar
        support_info = [
            f"PDF Support: Available",
            f"Text Support: Available",
            f"Excel Support: {'Available' if EXCEL_SUPPORT else 'Not available - install pandas and unstructured'}",
            f"Word Support: {'Available' if WORD_SUPPORT else 'Not available - install python-docx2txt'}",
            f"PowerPoint Support: {'Available' if PPTX_SUPPORT else 'Not available - install unstructured'}",
            f"SAS Support: {'Available' if SAS_SUPPORT else 'Not available - install pyreadstat and pandas'}",
            f"OCR Support: {'Available' if OCR_AVAILABLE else 'Not available - install pytesseract and pdf2image'}"
        ]
        
        for info in support_info:
            logger.info(info)
            # Only show in sidebar if explicitly debugging
            if debug and st.session_state.get('show_debug_info', False):
                st.sidebar.info(info)
    
    def setup_progress_tracking(self, total_files: int) -> None:
        """Set up progress tracking in the UI"""
        self.total_files = total_files
        self.files_processed = 0
        self.progress_container = st.empty()
        with self.progress_container.container():
            self.progress_bar = st.progress(0)
            self.status_text = st.empty()
        self.processing_start_time = time.time()
    
    def update_progress(self, file_name: str, file_type: str, success: bool = True) -> None:
        """Update the progress bar and status text"""
        self.files_processed += 1
        
        # Calculate progress percentage
        progress = self.files_processed / self.total_files if self.total_files > 0 else 0
        
        # Update progress bar
        if self.progress_bar:
            self.progress_bar.progress(progress)
        
        # Format status message
        elapsed_time = time.time() - self.processing_start_time
        status = f"Processed {self.files_processed}/{self.total_files} files ({progress:.0%}) - Elapsed: {elapsed_time:.1f}s"
        
        # Add file info
        file_status = f"✅ {file_name}" if success else f"❌ {file_name}"
        
        # Update both terminal and streamlit
        logger.info(f"{file_status} [{file_type}] - {status}")
        
        if self.status_text:
            self.status_text.text(f"{status}\nLast file: {file_status} [{file_type}]")
        
        # Update file type counter if successful
        if success and file_type in self.file_type_counts:
            self.file_type_counts[file_type] += 1
    
    def finish_progress(self):
        """Complete the progress tracking and show summary"""
        if self.progress_bar:
            self.progress_bar.progress(1.0)
        
        elapsed_time = time.time() - self.processing_start_time
        summary = (
            f"Completed processing {self.files_processed} files in {elapsed_time:.1f} seconds\n"
            f"PDFs: {self.file_type_counts['pdf']}, "
            f"Text: {self.file_type_counts['text']}, "
            f"Excel: {self.file_type_counts['excel']}, "
            f"Word: {self.file_type_counts['word']}, "
            f"PowerPoint: {self.file_type_counts['pptx']}, "
            f"SAS Data: {self.file_type_counts['sas_data']}, "
            f"SAS Code: {self.file_type_counts['sas_code']}"
        )
        
        logger.info(summary)
        if self.status_text:
            self.status_text.text(summary)
    
    def process_directory(self, directory_path: str) -> bool:
        """Process all documents in a directory with background processing"""
        start_time = time.time()
        logger.info(f"Processing directory: {directory_path}")
        
        if not os.path.exists(directory_path):
            error_msg = f"Directory not found: {directory_path}"
            logger.error(error_msg)
            if self.debug:
                st.error(error_msg)
            return False
        
        try:
            # Get all files from the directory
            all_files = os.listdir(directory_path)
            logger.info(f"Found {len(all_files)} files in directory {directory_path}")
            
            # Group files by type
            pdf_files = [f for f in all_files if f.lower().endswith('.pdf')]
            text_files = [f for f in all_files if f.lower().endswith(('.txt', '.md', '.csv', '.json'))]
            excel_files = [f for f in all_files if f.lower().endswith(('.xlsx', '.xls'))] if EXCEL_SUPPORT else []
            word_files = [f for f in all_files if f.lower().endswith(('.docx', '.doc'))] if WORD_SUPPORT else []
            pptx_files = [f for f in all_files if f.lower().endswith(('.pptx', '.ppt'))] if PPTX_SUPPORT else []
            sas_files = [f for f in all_files if f.lower().endswith(('.sas7bdat', '.sas'))] if SAS_SUPPORT else []  # Add SAS files
        
            
            # Get files to process (new or changed)
            all_file_paths = []
            for file_list in [pdf_files, text_files, excel_files, word_files, pptx_files, sas_files]:
                for file in file_list:
                    file_path = os.path.join(directory_path, file)
                    if self.vector_store.file_needs_processing(file_path):
                        all_file_paths.append(file_path)
            
            # If no files need processing, we're done
            if not all_file_paths:
                logger.info("No new or changed files to process")
                if self.debug:
                    st.success("All files already processed. No changes detected.")
                return True
            
            # Reset file type counters
            self.file_type_counts = {k: 0 for k in self.file_type_counts}
                
            # Setup progress tracking for files that need processing
            self.setup_progress_tracking(len(all_file_paths))
            logger.info(f"Processing {len(all_file_paths)} new or changed files")
            
            # Process each file
            all_documents = []
            
            # Process each file
            for file_path in all_file_paths:
                file_name = os.path.basename(file_path)
                file_ext = os.path.splitext(file_name)[1].lower()
                
                # Process based on file type
                if file_ext == '.pdf':
                    docs = self.process_pdf(file_path)
                    success = len(docs) > 0
                    self.update_progress(file_name, "pdf", success)
                    if success:
                        all_documents.extend(docs)
                        self.vector_store.mark_file_processed(file_path)
                
                elif file_ext in ['.txt', '.md', '.csv', '.json']:
                    docs = self.process_text_file(file_path)
                    success = len(docs) > 0
                    self.update_progress(file_name, "text", success)
                    if success:
                        all_documents.extend(docs)
                        self.vector_store.mark_file_processed(file_path)
                
                elif file_ext in ['.xlsx', '.xls'] and EXCEL_SUPPORT:
                    docs = self.process_excel_file(file_path)
                    success = len(docs) > 0
                    self.update_progress(file_name, "excel", success)
                    if success:
                        all_documents.extend(docs)
                        self.vector_store.mark_file_processed(file_path)
                
                elif file_ext in ['.docx', '.doc'] and WORD_SUPPORT:
                    docs = self.process_word_file(file_path)
                    success = len(docs) > 0
                    self.update_progress(file_name, "word", success)
                    if success:
                        all_documents.extend(docs)
                        self.vector_store.mark_file_processed(file_path)
                
                elif file_ext in ['.pptx', '.ppt'] and PPTX_SUPPORT:
                    docs = self.process_powerpoint_file(file_path)
                    success = len(docs) > 0
                    self.update_progress(file_name, "pptx", success)
                    if success:
                        all_documents.extend(docs)
                        self.vector_store.mark_file_processed(file_path)

                elif file_ext == '.sas7bdat':
                    docs = self.process_sas_file(file_path)
                    success = len(docs) > 0
                    self.update_progress(file_name, "sas_data", success)
                    if success:
                        all_documents.extend(docs)
                        self.vector_store.mark_file_processed(file_path)
                
                elif file_ext == '.sas':
                    docs = self.process_sas_file(file_path)
                    success = len(docs) > 0
                    self.update_progress(file_name, "sas_code", success)
                    if success:
                        all_documents.extend(docs)
                        self.vector_store.mark_file_processed(file_path)

            # Finish progress tracking
            self.finish_progress()
            
            # If no documents were processed successfully, we're done
            if not all_documents:
                logger.warning("No documents were successfully processed")
                return False
            
            # Split documents into chunks
            logger.info(f"Splitting {len(all_documents)} document segments/pages into chunks...")
            chunked_documents = self.split_documents(all_documents)
            
            if not chunked_documents:
                logger.error("Failed to split documents")
                return False
            
            # Queue documents for background processing
            success = self.vector_store.add_documents_async(chunked_documents)
            
            total_time = time.time() - start_time
            logger.info(f"Document processing queued in {total_time:.1f} seconds")
            
            if self.debug:
                if success:
                    st.success("Documents queued for processing in the background")
                else:
                    st.error("Failed to queue documents for processing")
                    
            return success
        except Exception as e:
            error_msg = f"Error processing directory: {str(e)}"
            logger.error(error_msg)
            if self.debug:
                st.error(error_msg)
            return False

    def display_processing_status(self):
        status_container = st.empty()
        
        while self.vector_store.is_processing():
            status = self.vector_store.get_processing_status()
            progress = status["progress"]
            
            status_container.info(f"""
            Processing documents in background:
            - Status: {status['status']}
            - Processed: {progress['processed']}/{progress['total']} documents
            - Batch: {progress['current_batch']}/{progress['total_batches']}
            """)
            
            # Sleep to prevent UI freezing
            time.sleep(1)
        
        status_container.success("Document processing complete!")

    def process_sas_program(self, file_path: str) -> List[Document]:
        """Process a SAS program file (.sas) as code with syntax recognition"""
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return []
                
        filename = os.path.basename(file_path)
        
        try:
            # Read as text file
            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
            
            # Parse SAS code to identify sections and procedures
            code_sections = []
            current_section = []
            in_proc = False
            proc_name = ""
            
            for line in content.split('\n'):
                line_lower = line.lower().strip()
                
                # Detect proc statements
                if line_lower.startswith('proc '):
                    if in_proc and current_section:
                        # Save the previous procedure
                        code_sections.append({
                            "type": "procedure",
                            "name": proc_name,
                            "content": "\n".join(current_section)
                        })
                        current_section = []
                    
                    # Start a new procedure
                    in_proc = True
                    parts = line_lower.split()
                    proc_name = parts[1] if len(parts) > 1 else "unknown"
                    current_section.append(line)
                    
                # Detect data steps
                elif line_lower.startswith('data '):
                    if in_proc and current_section:
                        # Save the previous procedure
                        code_sections.append({
                            "type": "procedure",
                            "name": proc_name,
                            "content": "\n".join(current_section)
                        })
                        current_section = []
                    
                    in_proc = False
                    proc_name = ""
                    current_section.append(line)
                    code_sections.append({
                        "type": "data_step",
                        "content": line
                    })
                    
                # End of a procedure
                elif line_lower.startswith('quit;') or line_lower == 'run;':
                    if in_proc:
                        current_section.append(line)
                        code_sections.append({
                            "type": "procedure",
                            "name": proc_name,
                            "content": "\n".join(current_section)
                        })
                        current_section = []
                        in_proc = False
                        proc_name = ""
                    else:
                        current_section.append(line)
                        
                # Default: add to current section
                else:
                    current_section.append(line)
            
            # Add any remaining content
            if current_section:
                if in_proc:
                    code_sections.append({
                        "type": "procedure",
                        "name": proc_name,
                        "content": "\n".join(current_section)
                    })
                else:
                    code_sections.append({
                        "type": "other",
                        "content": "\n".join(current_section)
                    })
            
            # Prepare structured content
            structured_content = []
            structured_content.append(f"Filename: {filename}")
            structured_content.append(f"File Type: SAS Program (Code)")
            structured_content.append(f"Size: {os.path.getsize(file_path)} bytes")
            structured_content.append("")
            
            # Add code structure information
            if code_sections:
                structured_content.append("## SAS Program Structure")
                for i, section in enumerate(code_sections):
                    if section["type"] == "procedure":
                        structured_content.append(f"{i+1}. PROC {section['name'].upper()}")
                    elif section["type"] == "data_step":
                        structured_content.append(f"{i+1}. DATA Step")
                    else:
                        structured_content.append(f"{i+1}. Other Code Section")
                structured_content.append("")
            
            # Add full code with proper code block formatting
            structured_content.append("## Full SAS Code")
            structured_content.append("```sas")
            structured_content.append(content)
            structured_content.append("```")
            
            # Add individual sections with context
            structured_content.append("## Code Sections")
            for i, section in enumerate(code_sections):
                if section["type"] == "procedure":
                    structured_content.append(f"### PROC {section['name'].upper()}")
                elif section["type"] == "data_step":
                    structured_content.append("### DATA Step")
                else:
                    structured_content.append("### Other Code")
                
                structured_content.append("```sas")
                structured_content.append(section["content"])
                structured_content.append("```")
                structured_content.append("")
            
            text_content = "\n".join(structured_content)
            
            # Create document with metadata
            doc = Document(
                page_content=text_content,
                metadata={
                    "source": filename,
                    "extraction_method": "sas_code_parser",
                    "doc_type": "sas_program",
                    "file_size": os.path.getsize(file_path),
                    "last_modified": os.path.getmtime(file_path),
                    "code_language": "sas",
                    "sections_count": len(code_sections)
                }
            )
            
            # Store the full text of the document
            self.all_document_content[filename] = text_content
            
            # Add metadata about the document
            self.document_metadata[filename] = {
                "pages": 1,
                "path": file_path,
                "size": os.path.getsize(file_path),
                "last_modified": os.path.getmtime(file_path),
                "filename": filename,
                "extension": ".sas",
                "type": "sas_code",
                "language": "sas",
                "sections_count": len(code_sections)
            }
            
            logger.info(f"Successfully processed SAS program file as code: {filename} with {len(code_sections)} sections")
            return [doc]
            
        except Exception as e:
            error_msg = f"Error processing SAS program file as code {file_path}: {str(e)}"
            logger.error(error_msg)
            return []

    def process_sas_file(self, file_path: str) -> List[Document]:
        """Process a SAS file and extract documents"""
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return []
                
        filename = os.path.basename(file_path)
        file_ext = os.path.splitext(filename)[1].lower()
        
        try:
            # Handle .sas7bdat files (SAS data files)
            if file_ext == '.sas7bdat':
                try:
                    import pandas as pd
                    import pyreadstat
                    
                    # Read SAS file into a pandas DataFrame using pyreadstat
                    df, meta = pyreadstat.read_sas7bdat(file_path)
                    
                    # Get metadata as string
                    meta_str = "\n".join([f"{key}: {value}" for key, value in meta.__dict__.items() 
                                        if not key.startswith('_') and value is not None])
                    
                    # Combine metadata and dataframe
                    text_content = f"Filename: {filename}\n\nMetadata:\n{meta_str}\n\nData:\n{df.to_string(index=True)}"
                    
                    # Create document with metadata
                    doc = Document(
                        page_content=text_content,
                        metadata={
                            "source": filename,
                            "extraction_method": "pyreadstat",
                            "doc_type": "sas_data",
                            "file_size": os.path.getsize(file_path),
                            "last_modified": os.path.getmtime(file_path)
                        }
                    )
                    
                    documents = [doc]
                    
                    # Store the full text of the document
                    self.all_document_content[filename] = text_content
                    
                    # Add metadata about the document
                    self.document_metadata[filename] = {
                        "pages": 1,
                        "path": file_path,
                        "size": os.path.getsize(file_path),
                        "last_modified": os.path.getmtime(file_path),
                        "filename": filename,
                        "extension": file_ext,
                        "type": "sas_data"
                    }
                    
                    logger.info(f"Successfully processed SAS data file: {filename}")
                    return documents
                    
                except ImportError as e:
                    logger.error(f"Missing required libraries for SAS data processing: {str(e)}")
                    logger.error("Install pyreadstat and pandas using pip")
                    return []
                except Exception as e:
                    error_msg = f"Error processing SAS data file {file_path}: {str(e)}"
                    logger.error(error_msg)
                    return []
            
            # Handle .sas files (SAS program files - code)
            elif file_ext == '.sas':
                # Process as code file using the specialized function
                return self.process_sas_program(file_path)
            
            else:
                logger.error(f"Unsupported SAS file extension: {file_ext}")
                return []
                
        except Exception as e:
            error_msg = f"Error processing SAS file {file_path}: {str(e)}"
            logger.error(error_msg)
            return []

    def process_pdf(self, file_path: str) -> List[Document]:
        """Process a single PDF file and extract documents with advanced handling"""
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return []
            
        filename = os.path.basename(file_path)
        
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
                documents = self._process_with_ocr(file_path)
            
            if not documents:
                logger.error(f"Could not extract text from {filename}")
                return []
            
            # Store the full text of the document
            full_text = "\n\n".join([doc.page_content for doc in documents])
            self.all_document_content[filename] = full_text
            
            # Add metadata about the document
            self.document_metadata[filename] = {
                "pages": len(documents),
                "path": file_path,
                "size": os.path.getsize(file_path),
                "last_modified": os.path.getmtime(file_path),
                "filename": filename,
                "extension": os.path.splitext(filename)[1].lower(),
                "type": "pdf"
            }
            
            # Enhance document metadata
            for i, doc in enumerate(documents):
                if not hasattr(doc, 'metadata'):
                    doc.metadata = {}
                
                # Add source filename
                doc.metadata['source'] = filename
                
                # Add page number if not present
                if 'page' not in doc.metadata:
                    doc.metadata['page'] = i + 1
                
                # Add document info
                doc.metadata['doc_type'] = 'pdf'
                doc.metadata['extraction_method'] = 'pymupdf'
                
                # Add file info
                doc.metadata['file_size'] = self.document_metadata[filename]['size']
                doc.metadata['last_modified'] = self.document_metadata[filename]['last_modified']
            
            logger.info(f"Successfully processed PDF: {filename} - extracted {len(documents)} pages")
            return documents
        except Exception as e:
            error_msg = f"Error processing PDF {file_path}: {str(e)}"
            logger.error(error_msg)
            return []
    
    def process_text_file(self, file_path: str) -> List[Document]:
        """Process a text file and extract documents"""
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return []
            
        filename = os.path.basename(file_path)
        
        try:
            # Use TextLoader for text files
            loader = TextLoader(file_path)
            documents = loader.load()
            
            if not documents:
                logger.error(f"Could not extract text from {filename}")
                return []
            
            # Store the full text of the document
            full_text = "\n\n".join([doc.page_content for doc in documents])
            self.all_document_content[filename] = full_text
            
            # Add metadata about the document
            self.document_metadata[filename] = {
                "pages": 1,  # Text files are treated as single page
                "path": file_path,
                "size": os.path.getsize(file_path),
                "last_modified": os.path.getmtime(file_path),
                "filename": filename,
                "extension": os.path.splitext(filename)[1].lower(),
                "type": "text"
            }
            
            # Enhance document metadata
            for doc in documents:
                if not hasattr(doc, 'metadata'):
                    doc.metadata = {}
                
                # Add source filename
                doc.metadata['source'] = filename
                
                # Add document info
                doc.metadata['doc_type'] = 'text'
                doc.metadata['extraction_method'] = 'text_loader'
                
                # Add file info
                doc.metadata['file_size'] = self.document_metadata[filename]['size']
                doc.metadata['last_modified'] = self.document_metadata[filename]['last_modified']
            
            logger.info(f"Successfully processed text file: {filename}")
            return documents
        except Exception as e:
            error_msg = f"Error processing text file {file_path}: {str(e)}"
            logger.error(error_msg)
            return []
    
    def process_excel_file(self, file_path: str) -> List[Document]:
        """Process an Excel file and extract documents"""
        if not EXCEL_SUPPORT:
            logger.error("Excel support not available. Install pandas and unstructured packages.")
            return []
            
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return []
            
        filename = os.path.basename(file_path)
        
        try:
            # First try with pandas as a backup
            try:
                # Read all sheets
                excel_data = pd.read_excel(file_path, sheet_name=None)
                
                documents = []
                for sheet_name, df in excel_data.items():
                    # Convert dataframe to string
                    text_content = f"Sheet: {sheet_name}\n\n{df.to_string(index=False)}"
                    
                    # Create document
                    doc = Document(
                        page_content=text_content,
                        metadata={
                            "source": filename,
                            "sheet": sheet_name,
                            "extraction_method": "pandas",
                            "doc_type": "excel"
                        }
                    )
                    documents.append(doc)
            except Exception as e:
                logger.warning(f"Pandas extraction failed for Excel file {filename}. Trying UnstructuredExcelLoader. Error: {e}")
                
                # Try with UnstructuredExcelLoader
                loader = UnstructuredExcelLoader(file_path, mode="elements")
                documents = loader.load()
            
            if not documents:
                logger.error(f"Could not extract content from Excel file {filename}")
                return []
            
            # Store the full text of the document
            full_text = "\n\n".join([doc.page_content for doc in documents])
            self.all_document_content[filename] = full_text
            
            # Add metadata about the document
            self.document_metadata[filename] = {
                "pages": len(documents),
                "path": file_path,
                "size": os.path.getsize(file_path),
                "last_modified": os.path.getmtime(file_path),
                "filename": filename,
                "extension": os.path.splitext(filename)[1].lower(),
                "type": "excel"
            }
            
            # Enhance document metadata
            for i, doc in enumerate(documents):
                if not hasattr(doc, 'metadata'):
                    doc.metadata = {}
                
                # Add source filename
                doc.metadata['source'] = filename
                
                # Add element/sheet number if not present
                if 'sheet' not in doc.metadata and 'element' not in doc.metadata:
                    doc.metadata['element'] = i + 1
                
                # Add document info if not present
