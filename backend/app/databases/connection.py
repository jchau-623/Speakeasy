from beanie import init_beanie, PydanticObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, Any, List
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from models.user import User
from models.idiom import Idiom
from models.slang import Slang

class Settings(BaseSettings):
    SECRET_KEY: Optional[str] = None
    DATABASE_URL: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    async def initialize_database(self):
        client = AsyncIOMotorClient(self.DATABASE_URL)
        await init_beanie(
            database=client.speakeasy,
            document_models=[User, Idiom, Slang]
        )

    class Config:
        env_file = ".env.prod"

settings = Settings()
print(f"Loaded SECRET_KEY: {settings.SECRET_KEY}")  # Проверка загрузки SECRET_KEY

class Database:
    def __init__(self, model):
        self.model = model

    async def save(self, document) -> None:
        await document.create()
        return

    async def get(self, id: PydanticObjectId) -> Any:
        doc = await self.model.get(id)
        if doc:
            return doc
        return False

    async def get_all(self) -> List[Any]:
        docs = await self.model.find_all().to_list()
        return docs

    async def update(self, id: PydanticObjectId, body: BaseModel) -> Any:
        doc_id = id
        des_body = body.dict()
        des_body = {k: v for k, v in des_body.items() if v is not None}
        update_query = {"$set": {
            field: value for field, value in des_body.items()
        }}

        doc = await self.get(doc_id)
        if not doc:
            return False
        await doc.update(update_query)
        return doc

    async def delete(self, id: PydanticObjectId) -> bool:
        doc = await self.get(id)
        if not doc:
            return False
        await doc.delete()
        return True
