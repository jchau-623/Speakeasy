from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from beanie import PydanticObjectId
from typing import Dict
from auth.jwt_handler import verify_access_token
from models.idiom import Idiom, IdiomResponse
from models.user import User

idiom_router = APIRouter(
    tags=["Idiom"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    user_id = payload.get("user")
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

@idiom_router.post("/", response_model=Dict[str, str])
async def create_idiom(idiom: Idiom, user: User = Depends(get_current_user)) -> Dict[str, str]:
    idiom_exist = await Idiom.find_one(Idiom.idiom == idiom.idiom)
    if idiom_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Idiom already exists"
        )
    
    idiom.user_id = user.id  # Set user_id from the authenticated user
    await idiom.insert()
    return {"id": str(idiom.id), "idiom": idiom.idiom, "language": idiom.language}

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
async def update_idiom(idiom_id: PydanticObjectId, idiom_data: Idiom, user: User = Depends(get_current_user)) -> IdiomResponse:
    idiom = await Idiom.find_one(Idiom.id == idiom_id, Idiom.user_id == user.id)
    if not idiom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idiom not found"
        )

    update_data = idiom_data.dict(exclude_unset=True)
    update_data['user_id'] = user.id

    await idiom.update({"$set": update_data})
    updated_idiom = await Idiom.get(idiom_id)
    return IdiomResponse(**updated_idiom.dict())

@idiom_router.delete("/{idiom_id}")
async def delete_idiom(idiom_id: PydanticObjectId, user: User = Depends(get_current_user)) -> dict:
    idiom = await Idiom.find_one(Idiom.id == idiom_id, Idiom.user_id == user.id)
    if not idiom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idiom not found"
        )

    await idiom.delete()
    return {"message": "Idiom deleted successfully"}