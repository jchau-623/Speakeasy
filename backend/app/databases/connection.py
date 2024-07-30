from beanie import init_beanie, PydanticObjectId, Document
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, Any, List, Type
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from models.idiom import Idiom

class Settings(BaseSettings):
    SECRET_KEY: Optional[str] = None
    DATABASE_URL: Optional[str] = None

    async def initialize_database(self):
        client = AsyncIOMotorClient(self.DATABASE_URL)
        await init_beanie(
            database=client.speakeasy,
            document_models=[Idiom]
        )

    class Config:
        env_file = ".env.prod"

class Database:
    def __init__(self, model: Type[Document]):
        self.model = model

    async def save(self, document: BaseModel) -> None:
        await document.create()

    async def get(self, id: PydanticObjectId) -> Any:
        doc = await self.model.get(id)
        return doc if doc else None

    async def get_all(self) -> List[Any]:
        return await self.model.find_all().to_list()

    async def update(self, id: PydanticObjectId, body: BaseModel) -> Any:
        des_body = {k: v for k, v in body.dict().items() if v is not None}
        update_query = {"$set": des_body}
        
        doc = await self.get(id)
        if not doc:
            return None
        await doc.update(update_query)
        return doc

    async def delete(self, id: PydanticObjectId) -> bool:
        doc = await self.get(id)
        if not doc:
            return False
        await doc.delete()
        return True

def get_database() -> Database:
    return Database(Idiom)
