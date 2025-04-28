
"""Utility functions for vector store operations"""
import os
import json
import logging
import hashlib
import time
from typing import Dict, Any

logger = logging.getLogger("DocumentIntelligence.VectorStore")

def save_json_safely(data: Dict[str, Any], file_path: str, temp_suffix: str = ".tmp") -> bool:
    """Safely save JSON data to file using a temporary file"""
    temp_path = file_path + temp_suffix
    try:
        # Save to temp file first
        with open(temp_path, 'w') as f:
            json.dump(data, f)
        # Then safely replace the original
        os.replace(temp_path, file_path)
        return True
    except Exception as e:
        logger.error(f"Error saving JSON data: {e}")
        return False

def load_json_safely(file_path: str) -> Dict[str, Any]:
    """Safely load JSON data from file"""
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Error loading JSON data: {e}")
    return {}

def create_backup(file_path: str, backup_dir: str, max_backups: int = 5) -> bool:
    """Create a backup of a file and manage backup rotation"""
    try:
        if not os.path.exists(file_path):
            return False
            
        os.makedirs(backup_dir, exist_ok=True)
        timestamp = int(time.time())
        backup_path = os.path.join(backup_dir, f"{os.path.basename(file_path)}_{timestamp}")
        
        import shutil
        shutil.copy2(file_path, backup_path)
        
        # Cleanup old backups
        existing_backups = sorted([f for f in os.listdir(backup_dir) 
                                 if f.startswith(os.path.basename(file_path))])
        if len(existing_backups) > max_backups:
            for old_backup in existing_backups[:-max_backups]:
                os.remove(os.path.join(backup_dir, old_backup))
        
        return True
    except Exception as e:
        logger.error(f"Error creating backup: {e}")
        return False

