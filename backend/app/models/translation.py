from beanie import Document
from pydantic import BaseModel, Field
from bson import ObjectId

class Translation(Document):
    idiom_id: ObjectId
    slang_id: ObjectId
    translation: str
    target_language: str

    class Settings:
        name = "translations"

    class Config:
        schema_extra = {
            "example": {
                "idiom_id": "60b8d2952f8fb814c0ef27f5",
                "slang_id": "60b8d2952f8fb814c0ef27f6",
                "translation": "Example translation",
                "target_language": "en"
            }
        }


class TranslationResponse(BaseModel):
    idiom_id: str
    slang_id: str
    translation: str
    target_language: str
