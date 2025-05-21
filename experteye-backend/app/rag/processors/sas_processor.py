
"""SAS file processing utilities"""
import os
import logging
from typing import List
from langchain_core.documents import Document
import pyreadstat
import pandas as pd

logger = logging.getLogger("DocumentIntelligence.SASProcessor")

def process_sas_data(file_path: str, filename: str) -> List[Document]:
    """Process SAS data files (.sas7bdat)"""
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return []
        
    try:
        # Read SAS file
        df, meta = pyreadstat.read_sas7bdat(file_path)
        
        # Get metadata as string
        meta_str = "\n".join([f"{key}: {value}" for key, value in meta.__dict__.items() 
                            if not key.startswith('_') and value is not None])
        
        # Combine metadata and dataframe
        text_content = f"Filename: {filename}\n\nMetadata:\n{meta_str}\n\nData:\n{df.to_string(index=True)}"
        
        # Create document
        doc = Document(
            page_content=text_content,
            metadata={
                'source': filename,
                'extraction_method': 'pyreadstat',
                'doc_type': 'sas_data',
                'file_size': os.path.getsize(file_path),
                'last_modified': os.path.getmtime(file_path)
            }
        )
        
        logger.info(f"Successfully processed SAS data file: {filename}")
        return [doc]
    except Exception as e:
        logger.error(f"Error processing SAS data file {file_path}: {str(e)}")
        return []

def process_sas_program(file_path: str, filename: str) -> List[Document]:
    """Process SAS program files (.sas)"""
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return []
        
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Parse SAS code sections
        code_sections = parse_sas_code(content)
        
        # Prepare structured content
        structured_content = []
        structured_content.append(f"Filename: {filename}")
        structured_content.append(f"File Type: SAS Program (Code)")
        structured_content.append(f"Size: {os.path.getsize(file_path)} bytes")
        structured_content.append("")
        
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
        
        # Add full code
        structured_content.append("## Full SAS Code")
        structured_content.append("```sas")
        structured_content.append(content)
        structured_content.append("```")
        
        # Create document
        doc = Document(
            page_content="\n".join(structured_content),
            metadata={
                'source': filename,
                'extraction_method': 'sas_code_parser',
                'doc_type': 'sas_program',
                'file_size': os.path.getsize(file_path),
                'last_modified': os.path.getmtime(file_path),
                'code_language': 'sas',
                'sections_count': len(code_sections)
            }
        )
        
        logger.info(f"Successfully processed SAS program file: {filename}")
        return [doc]
    except Exception as e:
        logger.error(f"Error processing SAS program file {file_path}: {str(e)}")
        return []

def parse_sas_code(content: str) -> List[dict]:
    """Parse SAS code into sections"""
    code_sections = []
    current_section = []
    in_proc = False
    proc_name = ""
    
    for line in content.split('\n'):
        line_lower = line.lower().strip()
        
        if line_lower.startswith('proc '):
            if in_proc and current_section:
                code_sections.append({
                    "type": "procedure",
                    "name": proc_name,
                    "content": "\n".join(current_section)
                })
                current_section = []
            
            in_proc = True
            parts = line_lower.split()
            proc_name = parts[1] if len(parts) > 1 else "unknown"
            current_section.append(line)
            
        elif line_lower.startswith('data '):
            if in_proc and current_section:
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
    
    return code_sections
