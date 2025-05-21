
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
import re

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
        # Re-hash admin password to ensure it works with current hashing algorithm
        for i, user in enumerate(users_db):
            if user["username"] == ADMIN_USERNAME:
                users_db[i]["hashed_password"] = get_password_hash(ADMIN_PASSWORD)
                save_user_db(users_db)
                break
        print(f"Admin user already exists: {ADMIN_USERNAME}")

def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate a user with username and password."""
    # ... keep existing code (authentication logic)
    
def is_password_unique(password: str) -> bool:
    """Check if a password is unique among all users."""
    # ... keep existing code (password uniqueness check)

def is_password_valid(password: str) -> tuple[bool, str]:
    """Validate password against security requirements."""
    if len(password) < 8 or len(password) > 12:
        return False, "Password must be between 8 and 12 characters"
    
    if not re.match(r'^[A-Z]', password):
        return False, "Password must start with an uppercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one digit"
    
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        return False, "Password must contain at least one special character"
    
    return True, ""

def create_user(username: str, email: str, password: str) -> Dict[str, Any]:
    """Create a new user."""
    users_db = get_user_db()
    
    # Check if username already exists (case-insensitive)
    if any(user["username"].lower() == username.lower() for user in users_db):
        raise ValueError("Username already exists")
    
    # Check if email already exists
    if any(user["email"] == email for user in users_db):
        raise ValueError("Email already exists")
    
    # Validate password
    is_valid, error_msg = is_password_valid(password)
    if not is_valid:
        raise ValueError(error_msg)
    
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
    print(f"User created: {username}")
    
    return user

def get_user(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user by ID."""
    users_db = get_user_db()
    return next((user for user in users_db if user["id"] == user_id), None)

def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    """Get user by username (case-insensitive)."""
    users_db = get_user_db()
    return next((user for user in users_db if user["username"].lower() == username.lower()), None)
