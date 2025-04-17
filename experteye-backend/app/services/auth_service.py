
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

from app.db.session import get_user_db, save_user_db
from app.core.security import verify_password, get_password_hash

# Admin user credentials
ADMIN_USERNAME = "admin"
ADMIN_EMAIL = "admin@experteye.com"
ADMIN_PASSWORD = "admin123"

def ensure_admin_user_exists():
    """Ensure that the admin user exists in the database."""
    users_db = get_user_db()
    
    # Check if admin user already exists
    admin_exists = any(user["username"] == ADMIN_USERNAME for user in users_db)
    
    if not admin_exists:
        # Create admin user
        admin_user = {
            "id": str(uuid.uuid4()),
            "username": ADMIN_USERNAME,
            "email": ADMIN_EMAIL,
            "hashed_password": get_password_hash(ADMIN_PASSWORD),
            "created_at": datetime.utcnow().isoformat(),
            "is_admin": True
        }
        
        users_db.append(admin_user)
        save_user_db(users_db)
        print(f"Admin user created: {ADMIN_USERNAME}")
    else:
        print(f"Admin user already exists: {ADMIN_USERNAME}")

def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate a user with username and password."""
    users_db = get_user_db()
    user = next((user for user in users_db if user["username"] == username), None)
    
    if not user or not verify_password(password, user["hashed_password"]):
        return None
        
    return user

def create_user(username: str, email: str, password: str) -> Dict[str, Any]:
    """Create a new user."""
    users_db = get_user_db()
    
    # Check if username already exists
    if any(user["username"] == username for user in users_db):
        raise ValueError("Username already exists")
    
    # Create new user
    user = {
        "id": str(uuid.uuid4()),
        "username": username,
        "email": email,
        "hashed_password": get_password_hash(password),
        "created_at": datetime.utcnow().isoformat(),
        "is_admin": False
    }
    
    users_db.append(user)
    save_user_db(users_db)
    
    return user

def get_user(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user by ID."""
    users_db = get_user_db()
    return next((user for user in users_db if user["id"] == user_id), None)

def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    """Get user by username."""
    users_db = get_user_db()
    return next((user for user in users_db if user["username"] == username), None)
