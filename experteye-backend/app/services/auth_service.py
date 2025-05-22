
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
            "plain_password": ADMIN_PASSWORD,  # Store plain password for admin
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
                users_db[i]["plain_password"] = ADMIN_PASSWORD  # Update plain password
                users_db[i]["hashed_password"] = get_password_hash(ADMIN_PASSWORD)
                save_user_db(users_db)
                break
        print(f"Admin user already exists: {ADMIN_USERNAME}")

def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate a user with username and password."""
    users_db = get_user_db()
    
    # Debug
    print(f"Authenticating user: {username}")
    
    # Try to find user by username or email (case-insensitive for username)
    user = next((user for user in users_db if 
                 user["username"].lower() == username.lower() or 
                 user["email"] == username), None)
    
    if not user:
        print(f"User not found: {username}")
        return None
    
    print(f"Found user: {user['username']}")
    
    # Special case for admin during development
    if (user["username"] == ADMIN_USERNAME and password == ADMIN_PASSWORD):
        print("Admin login with default password")
        # Update password hash if needed
        if not verify_password(password, user["hashed_password"]):
            print("Updating admin password hash")
            for i, u in enumerate(users_db):
                if u["username"] == ADMIN_USERNAME:
                    users_db[i]["plain_password"] = ADMIN_PASSWORD  # Update plain password
                    users_db[i]["hashed_password"] = get_password_hash(ADMIN_PASSWORD)
                    save_user_db(users_db)
                    break
        return user
    
    # Regular password check - we'll check both plain password and hashed password
    if "plain_password" in user and user["plain_password"] == password:
        print("Plain password match")
        return user
    elif verify_password(password, user["hashed_password"]):
        print("Password verified through hash")
        return user
    
    print("Password verification failed")
    return None

def is_password_unique(password: str) -> bool:
    """Check if a password is unique among all users."""
    users_db = get_user_db()
    
    # Now check both plain password and hashed password
    for user in users_db:
        if "plain_password" in user and user["plain_password"] == password:
            return False
        elif verify_password(password, user["hashed_password"]):
            return False
    
    return True

def create_user(username: str, email: str, password: str) -> Dict[str, Any]:
    """Create a new user."""
    users_db = get_user_db()
    
    # Check if username already exists (case-insensitive)
    if any(user["username"].lower() == username.lower() for user in users_db):
        raise ValueError("Username already exists")
    
    # Check if email already exists
    if any(user["email"] == email for user in users_db):
        raise ValueError("Email already exists")
    
    # Create new user
    user = {
        "id": str(uuid.uuid4()),
        "username": username,
        "email": email,
        "plain_password": password,  # Store plain password
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
