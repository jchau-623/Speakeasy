from beanie import Document
from pydantic import BaseModel

class Idiom(Document):
    idiom: str
    language: str

    class Settings:
        name = "idioms"

    class Config:
        schema_extra = {
            "example": {
                "idiom": "Break the ice",
                "language": "en"
            }
        }

class IdiomResponse(BaseModel):
    idiom: str
    language: str
