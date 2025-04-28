
"""Document chunking and processing utilities"""
from typing import List
from langchain_core.documents import Document
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter
)

def create_text_splitter(chunk_size: int = 500, chunk_overlap: int = 100) -> RecursiveCharacterTextSplitter:
    """Create a text splitter with given parameters"""
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""],
        add_start_index=True
    )

def create_markdown_splitter() -> MarkdownHeaderTextSplitter:
    """Create a markdown-aware text splitter"""
    return MarkdownHeaderTextSplitter(
        headers_to_split_on=[
            ("#", "Header 1"),
            ("##", "Header 2"),
            ("###", "Header 3"),
        ]
    )

def split_documents(documents: List[Document], chunk_size: int = 500, chunk_overlap: int = 100) -> List[Document]:
    """Split documents into chunks"""
    if not documents:
        return []
    
    text_splitter = create_text_splitter(chunk_size, chunk_overlap)
    return text_splitter.split_documents(documents)
