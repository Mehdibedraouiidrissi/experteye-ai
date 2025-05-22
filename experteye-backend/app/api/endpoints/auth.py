from fastapi import APIRouter, Depends, HTTPException, status, Body, Response, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from datetime import timedelta
from typing import Dict, Optional
from jose import jwt, JWTError
import re

from app.core.security import create_access_token, verify_password
from app.core.config import settings
from app.db.session import get_user_db
from app.services.auth_service import authenticate_user, create_user, get_user_by_username, is_password_unique

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# Remove explicit OPTIONS handler and let CORSMiddleware handle preflight

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"Login attempt: {form_data.username}")
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    print(f"User {user['username']} authenticated successfully")
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(
    username: str = Body(...),
    email: str = Body(...),
    password: str = Body(...)
):
    # Validate input
    if not username or not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All fields are required"
        )
    
    # Validate email domain
    if not email.endswith("@experteye.com"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only @experteye.com email addresses are allowed"
        )
    
    # Validate password
    if len(password) < 8 or len(password) > 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be between 8 and 12 characters"
        )

    if not password[0].isupper():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must start with an uppercase letter"
        )

    if not re.search(r'\d', password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one digit"
        )
    
    # Check if password is unique
    if not is_password_unique(password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password is already in use by another user"
        )
    
    # Check if username already exists (case-insensitive)
    users_db = get_user_db()
    if any(user["username"].lower() == username.lower() for user in users_db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    if any(user["email"] == email for user in users_db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        user = create_user(username, email, password)
        return {"username": user["username"], "email": user["email"], "message": "User created successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = get_user_by_username(username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Remove sensitive information
    safe_user = {k: v for k, v in user.items() if k != "hashed_password" and k != "plain_password"}
    return safe_user

@router.get("/health")
async def health_check():
    return {"status": "ok"}
