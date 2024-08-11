from beanie import Document, PydanticObjectId
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class FavoriteItem(BaseModel):
    id: str = Field(alias="_id")
    term: Optional[str] = None
    idiom: Optional[str] = None
    meaning: str
    origin: str
    exampleUse: str
    equivalentInLanguage: Optional[str] = None
    createdAt: datetime
    user_id: str
    
class HistoryItem(BaseModel):
    id: str = Field(alias="_id")
    term: Optional[str] = None
    idiom: Optional[str] = None
    meaning: str
    origin: str
    exampleUse: str
    equivalentInLanguage: Optional[str] = None
    createdAt: datetime
    user_id: str
    

class User(Document):

    id: PydanticObjectId = None  # leslie
    email: EmailStr
    password: str
    favorite: List[FavoriteItem] = []
    history: List[HistoryItem] = []

    class Settings:
        name = "users"

    class Config:
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "password"
            }
        }


class TokenResponse(BaseModel):
    # access_token: str
    # token_type: str
    user: User


class MessageResponse(BaseModel):
    message: str


class UserResponse(BaseModel):
    id: PydanticObjectId
    email: EmailStr
    favorite: List[FavoriteItem] = []
    history: List[HistoryItem] = []