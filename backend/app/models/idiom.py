from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional

class Idiom(Document):
    name: str
    meaning: str
    example: Optional[str]
    user_id: str

    class Settings:
        collection = "idioms"

class IdiomCreate(BaseModel):
    name: str
    meaning: str
    example: Optional[str]

class IdiomResponse(IdiomCreate):
    id: str = Field(..., alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
