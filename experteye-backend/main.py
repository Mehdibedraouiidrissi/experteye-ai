
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.db.session import init_db
from app.services.auth_service import ensure_admin_user_exists

# Initialize the database
init_db()

# Create admin user on startup
ensure_admin_user_exists()

app = FastAPI(title="ExpertEye API")

# Configure CORS - include all relevant origins
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # Common React port
    "http://localhost:8080",  # Your current frontend
    "http://127.0.0.1:8080",  # Local IP alternative
    "http://172.18.1.5:8080", # Network IP from logs
    "http://172.19.16.1:8080" # Network IP from logs
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
