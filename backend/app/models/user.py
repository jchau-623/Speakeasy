from beanie import Document
from pydantic import BaseModel, EmailStr
from typing import List

class User(Document):
    email: EmailStr
    password: str

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
    access_token: str
    token_type: str
