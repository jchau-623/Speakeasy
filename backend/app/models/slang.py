from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime

class Slang(Document):
    id: UUID = Field(default_factory=uuid4, alias="_id")
    term: str
    meaning: str
    origin: str
    exampleUse: str
    equivalentInLanguage: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    user_id: str

    class Settings:
        collection = "slangs"
        arbitrary_types_allowed = True

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {UUID: str}

class SlangCreate(BaseModel):
    term: str
    user_id: str  # Include user_id here

class SlangResponse(BaseModel):
    id: UUID = Field(default_factory=uuid4, alias="_id")
    term: str
    meaning: str
    origin: str
    exampleUse: str
    equivalentInLanguage: Optional[str]
    createdAt: datetime
    user_id: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {UUID: str}
