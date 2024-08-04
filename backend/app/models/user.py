from beanie import Document, PydanticObjectId
from pydantic import BaseModel, EmailStr
from typing import List

class User(Document):

    id: PydanticObjectId = None  # leslie
    email: EmailStr
    password: str
    favorite: List[str] = []

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
    favorite: List[str] = []