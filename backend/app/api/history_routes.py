from fastapi import APIRouter, Depends
from beanie import PydanticObjectId
from models.idiom import Idiom, IdiomResponse
from models.user import User

history_router = APIRouter(
    tags=["History"]
)

async def get_current_user():
    return await User.get(PydanticObjectId("60f8f5f0a5c0d35a78b38b1d")) 

@history_router.get("/history", response_model=dict)
async def get_user_history(user: User = Depends(get_current_user)):
    idioms = await Idiom.find(Idiom.user_id == user.id).to_list()

    return {
        "idioms": [IdiomResponse(**idiom.dict()) for idiom in idioms]
    }
