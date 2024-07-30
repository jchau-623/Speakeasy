from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID, uuid4

class Slang(Document):
    id: UUID = Field(default_factory=uuid4, alias="_id")
    name: str
    meaning: str
    example: Optional[str]
    user_id: str

    class Settings:
        collection = "slangs"
        arbitrary_types_allowed = True

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {UUID: str}

class SlangCreate(BaseModel):
    name: str
    meaning: str
    example: Optional[str]

class SlangResponse(BaseModel):
    id: UUID = Field(alias="_id")
    name: str
    meaning: str
    example: Optional[str]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
