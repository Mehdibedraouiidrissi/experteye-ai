
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
import random
import os
import psutil
from typing import Dict, Any, List

from app.core.dependencies import get_current_user
from app.db.session import get_document_db, get_user_db, get_chat_db, get_message_db
from app.services.document_service import list_documents

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(user: Dict[str, Any] = Depends(get_current_user)):
    """Get dashboard statistics for the admin panel"""
    # Get database content
    documents_db = get_document_db()
    users_db = get_user_db()
    chats_db = get_chat_db()
    messages_db = get_message_db()
    
    # Documents stats
    total_documents = len(documents_db)
    
    # Count documents uploaded today
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    uploaded_today = sum(1 for doc in documents_db if datetime.fromisoformat(doc.get("created_at", "2023-01-01T00:00:00")).replace(tzinfo=None) >= today)
    
    # Get document types count
    document_types = {}
    for doc in documents_db:
        file_ext = os.path.splitext(doc.get("filename", ""))[1].lower()
        if file_ext:
            # Remove the dot from extension
            doc_type = file_ext[1:]
            if doc_type in document_types:
                document_types[doc_type] += 1
            else:
                document_types[doc_type] = 1
    
    # Conversations stats
    total_conversations = len(chats_db)
    
    # Count active conversations today
    active_today = sum(1 for chat in chats_db if "last_activity" in chat and 
                       datetime.fromisoformat(chat.get("last_activity", "2023-01-01T00:00:00")).replace(tzinfo=None) >= today)
    
    # Users stats
    total_users = len(users_db)
    admin_count = sum(1 for user in users_db if user.get("is_admin", False))
    
    # Simulate active users - in a real app you'd track this
    active_now = min(random.randint(1, max(2, total_users // 2)), total_users)
    
    # Vector DB stats
    # In a real scenario, you'd query your vector database
    # We'll create a realistic estimate based on documents
    avg_chunks_per_document = 50  # Estimate: each document becomes ~50 text chunks on average
    total_chunks = total_documents * avg_chunks_per_document
    
    # System stats
    # Get RAM usage
    ram = psutil.virtual_memory()
    ram_used = ram.used // (1024 * 1024)  # MB
    ram_total = ram.total // (1024 * 1024)  # MB
    
    # Get CPU usage
    cpu_percent = psutil.cpu_percent(interval=0.1)
    
    # Generate simulated recent activity
    recent_activity = generate_recent_activity(users_db, documents_db)
    
    # Recent user actions
    recent_actions = [
        {"time": (datetime.now() - timedelta(minutes=2)).isoformat(), "action": "Uploaded financial report.pdf"},
        {"time": (datetime.now() - timedelta(minutes=7)).isoformat(), "action": "Started new conversation"},
        {"time": (datetime.now() - timedelta(hours=1)).isoformat(), "action": "Updated system settings"},
        {"time": (datetime.now() - timedelta(hours=3)).isoformat(), "action": "Added a new data source"},
    ]
    
    # Calculate processing documents
    processing_docs = sum(1 for doc in documents_db if doc.get("processing_status") == "processing")
    processed_docs = sum(1 for doc in documents_db if doc.get("processed") is True)
    
    return {
        "documents": {
            "total": total_documents,
            "uploadedToday": uploaded_today,
            "trend": 16 if total_documents > 0 else 0,  # Example trend percentage
        },
        "conversations": {
            "total": total_conversations,
            "activeToday": active_today,
            "trend": 24 if total_conversations > 0 else 0,  # Example trend percentage
        },
        "users": {
            "total": total_users,
            "activeNow": active_now,
            "trend": 8 if total_users > 0 else 0,  # Example trend percentage
        },
        "vectorDb": {
            "totalChunks": total_chunks,
            "trend": 32 if total_chunks > 0 else 0,  # Example trend percentage
        },
        "recentActivity": recent_activity,
        "system": {
            "ram": {
                "used": ram_used,
                "total": ram_total,
            },
            "cpu": cpu_percent,
            "apiRequests": random.randint(30, 120),  # Simulated API request rate
            "vectorDbSize": total_chunks * 0.0002 + 0.5,  # Estimate: ~0.2KB per chunk + 0.5GB base size
            "modelSize": 1.5,  # Size in GB - deepseek:1.5b model
            "documents": {
                "total": total_documents,
                "processed": processed_docs,
                "processing": processing_docs,
                "types": document_types,
            },
            "users": {
                "total": total_users,
                "admins": admin_count,
                "activeSessions": active_now,
                "recentActions": recent_actions,
            }
        }
    }

def generate_recent_activity(users_db, documents_db):
    """Generate realistic recent activity data"""
    activity = []
    
    # Get some user IDs for the activity
    user_ids = [user["id"] for user in users_db[:min(5, len(users_db))]]
    if not user_ids:
        user_ids = ["admin"]
    
    # Get some document names
    doc_names = [doc.get("filename", "document.pdf") for doc in documents_db[:min(5, len(documents_db))]]
    if not doc_names:
        doc_names = ["report.pdf", "presentation.pptx", "data.xlsx", "memo.docx"]
    
    # Activity types
    activity_types = [
        {"action": f"Uploaded document: {random.choice(doc_names)}", "user": "Admin User"},
        {"action": "Started a new conversation", "user": "John D."},
        {"action": f"Downloaded {random.choice(doc_names)}", "user": "Sarah M."},
        {"action": "Updated system settings", "user": "Admin User"},
        {"action": "Added a new user account", "user": "Admin User"},
        {"action": "Shared conversation results", "user": "Michael B."},
        {"action": "Completed document processing", "user": "System"}
    ]
    
    # Generate 10 realistic activity items
    for i in range(10):
        item = random.choice(activity_types)
        timestamp = datetime.now() - timedelta(minutes=random.randint(1, 600))  # Up to 10 hours ago
        
        activity.append({
            "id": f"act-{i + 1}",
            "action": item["action"],
            "timestamp": timestamp.isoformat(),
            "user": item["user"]
        })
    
    # Sort by timestamp (newest first)
    activity.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return activity
