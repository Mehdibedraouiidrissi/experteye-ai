
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.api import api_router
from app.core.config import settings

app = FastAPI(
    title="ExpertEye Document Intelligence",
    description="RAG-based system for document intelligence",
    version="0.1.0",
)

# Configure CORS with more permissive settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080", "http://127.0.0.1:5173", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add API routes
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    print(f"Starting backend server on port 5000...")
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
