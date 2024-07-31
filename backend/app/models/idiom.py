from beanie import Document, PydanticObjectId
from pydantic import BaseModel

class Idiom(Document):
    idiom: str
    language: str
    user_id: PydanticObjectId

    class Settings:
        name = "idioms"

    class Config:
        schema_extra = {
            "example": {
                "idiom": "Break the ice",
                "language": "en",
                "user_id": "60f8f5f0a5c0d35a78b38b1d"
            }
        }

class IdiomResponse(BaseModel):
    idiom: str
    language: str
    user_id: PydanticObjectId
