
from fastapi import APIRouter
from app.api.endpoints import auth, chat, documents, dashboard

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
