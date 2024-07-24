from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID, uuid4

class Idiom(Document):
    id: UUID = Field(default_factory=uuid4, alias="_id")
    name: str
    meaning: str
    example: Optional[str]
    user_id: str

    class Settings:
        collection = "idioms"
        arbitrary_types_allowed = True

class IdiomCreate(BaseModel):
    name: str
    meaning: str
    example: Optional[str]

class IdiomResponse(IdiomCreate):
    id: UUID

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
