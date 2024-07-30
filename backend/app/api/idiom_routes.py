from fastapi import APIRouter, HTTPException, status
from beanie import PydanticObjectId
from models.idiom import Idiom, IdiomResponse

idiom_router = APIRouter(
    tags=["Idiom"]
)

@idiom_router.post("/", response_model=IdiomResponse)
async def create_idiom(idiom: Idiom) -> IdiomResponse:
    idiom_exist = await Idiom.find_one(Idiom.idiom == idiom.idiom)
    if idiom_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Idiom already exists"
        )

    await idiom.insert()
    return IdiomResponse(**idiom.dict())

@idiom_router.get("/{idiom_id}", response_model=IdiomResponse)
async def get_idiom(idiom_id: PydanticObjectId) -> IdiomResponse:
    idiom = await Idiom.get(idiom_id)
    if not idiom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idiom not found"
        )
    return IdiomResponse(**idiom.dict())

@idiom_router.put("/{idiom_id}", response_model=IdiomResponse)
async def update_idiom(idiom_id: PydanticObjectId, idiom_data: Idiom) -> IdiomResponse:
    idiom = await Idiom.get(idiom_id)
    if not idiom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idiom not found"
        )

    await idiom.set(idiom_data.dict())
    return IdiomResponse(**idiom.dict())

@idiom_router.delete("/{idiom_id}")
async def delete_idiom(idiom_id: PydanticObjectId) -> dict:
    idiom = await Idiom.get(idiom_id)
    if not idiom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idiom not found"
        )

    await idiom.delete()
    return {
        "message": "Idiom deleted successfully"
    }
