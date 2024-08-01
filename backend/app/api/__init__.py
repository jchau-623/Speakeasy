from fastapi import APIRouter
from .user_routes import user_router

api_router = APIRouter()
api_router.include_router(user_router, prefix="/api/user")