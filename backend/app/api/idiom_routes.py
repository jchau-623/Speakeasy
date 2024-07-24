from fastapi import APIRouter, HTTPException
from models.idiom import Idiom, IdiomCreate, IdiomResponse
from databases.connection import Database
from typing import List
from uuid import UUID

idiom_router = APIRouter()

database = Database(Idiom)

@idiom_router.post("/", response_model=IdiomResponse)
async def create_idiom(idiom: IdiomCreate, user_id: str):
    new_idiom = Idiom(**idiom.dict(), user_id=user_id)
    await database.save(new_idiom)
    return IdiomResponse(**new_idiom.dict(by_alias=True))

@idiom_router.get("/{id}", response_model=IdiomResponse)
async def get_idiom(id: UUID):
    idiom = await database.get(id)
    if not idiom:
        raise HTTPException(status_code=404, detail="Idiom not found")
    return IdiomResponse(**idiom.dict(by_alias=True))

@idiom_router.get("/", response_model=List[IdiomResponse])
async def get_idioms():
    idioms = await database.get_all()
    return [IdiomResponse(**idiom.dict(by_alias=True)) for idiom in idioms]

@idiom_router.put("/{id}", response_model=IdiomResponse)
async def update_idiom(id: UUID, idiom: IdiomCreate):
    updated_idiom = await database.update(id, idiom)
    if not updated_idiom:
        raise HTTPException(status_code=404, detail="Idiom not found")
    return IdiomResponse(**updated_idiom.dict(by_alias=True))

@idiom_router.delete("/{id}", response_model=bool)
async def delete_idiom(id: UUID):
    deleted = await database.delete(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Idiom not found")
    return True
