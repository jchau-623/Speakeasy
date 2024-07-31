# history_routes.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Dict
from auth.jwt_handler import decode_access_token
from models.idiom import Idiom, IdiomResponse
from models.user import User

history_router = APIRouter(
    tags=["History"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    user = await User.get(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found" 
        )
    return user

@history_router.get("/history", response_model=Dict[str, List[IdiomResponse]])
async def get_user_history(user: User = Depends(get_current_user)):
    idioms = await Idiom.find(Idiom.user_id == user.id).to_list()
    return {
        "idioms": [IdiomResponse(**idiom.dict()) for idiom in idioms]
    }

@history_router.delete("/history/{idiom_id}", response_model=Dict[str, str])
async def delete_user_history(idiom_id: str, user: User = Depends(get_current_user)):
    idiom = await Idiom.find_one(Idiom.id == idiom_id, Idiom.user_id == user.id)
    if not idiom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idiom not found in user history"
        )
    await idiom.delete()
    return {"message": "Idiom deleted from user history"}

@history_router.put("/history/{idiom_id}", response_model=IdiomResponse)
async def update_user_history(idiom_id: str, idiom_data: Idiom, user: User = Depends(get_current_user)):
    idiom = await Idiom.find_one(Idiom.id == idiom_id, Idiom.user_id == user.id)
    if not idiom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idiom not found in user history"
        )
    await idiom.update({"$set": idiom_data.dict(exclude_unset=True)})
    updated_idiom = await Idiom.get(idiom_id)
    return IdiomResponse(**updated_idiom.dict())
