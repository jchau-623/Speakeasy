from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional

class Slang(Document):
    slang: str
    language: str

    class Settings:
        name = "slangs"

    class Config:
        schema_extra = {
            "example": {
                "slang": "GOAT",
                "language": "en"
            }
        }


class SlangResponse(BaseModel):
    idiom: str
    language: str
