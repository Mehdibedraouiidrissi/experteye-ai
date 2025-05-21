
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.db.session import init_db
from app.services.auth_service import ensure_admin_user_exists

# Initialize the database
init_db()

# Create admin user on startup
ensure_admin_user_exists()

app = FastAPI(title="ExpertEye API")

# Configure CORS with permissive settings for development
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # Common React port
    "http://localhost:8080",  # Your current frontend
    "http://127.0.0.1:8080",  # Local IP alternative
    "http://localhost:*",     # Any localhost port
    "http://127.0.0.1:*",     # Any 127.0.0.1 port
    "http://172.17.0.13:8080", # Network IP from your logs
    "http://192.168.11.105:8080", # Network IP from your logs
]

# Configure CORS middleware with permissive settings for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=600,  # Limit preflight cache to 10 minutes
)

# Include API router
app.include_router(api_router, prefix="/api")

# Add specific healthcheck endpoint for frontend to test connectivity
@app.get("/api/healthcheck")
async def healthcheck():
    return {"status": "healthy", "message": "API server is running"}

# Add simple root endpoint for testing
@app.get("/")
async def root():
    return {"message": "Welcome to ExpertEye API", "status": "online"}

# Add diagnostic route to check environment
@app.get("/api/diagnostic")
async def diagnostic():
    import sys
    import platform
    
    return {
        "python_version": sys.version,
        "platform": platform.platform(),
        "api_status": "ok",
        "environment": "development" if os.environ.get("ENV") != "production" else "production"
    }

if __name__ == "__main__":
    import uvicorn
    
    # Print server information
    print("\n" + "="*50)
    print(" ExpertEye Backend Server")
    print("="*50)
    print(f" Host: 0.0.0.0")
    print(f" Port: 5000")
    print(f" API URL: http://localhost:5000/api")
    print(f" Healthcheck URL: http://localhost:5000/api/healthcheck")
    print(f" API Docs: http://localhost:5000/docs")
    print("="*50 + "\n")
    
    # Use host 0.0.0.0 to allow external connections
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")
