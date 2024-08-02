import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Dict
from auth.jwt_handler import verify_access_token
from models.idiom import Idiom, IdiomResponse
from models.user import User
from beanie import PydanticObjectId

history_router = APIRouter(
    tags=["History"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    user_id = payload.get("user")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    user = await User.find_one(User.email == user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

@history_router.get("/", response_model=Dict[str, List[IdiomResponse]])
async def get_user_history(user: User = Depends(get_current_user)):
    try:
        logger.info(f"Fetching idioms for user_id: {user.id}")
        idioms = await Idiom.find(Idiom.user_id == PydanticObjectId(user.id)).to_list()
        if not idioms:
            logger.info(f"No idioms found for user_id: {user.id}")
            return {"idioms": []}
        logger.info(f"Found idioms: {idioms}")
        return {
            "idioms": [IdiomResponse(**idiom.dict()) for idiom in idioms]
        }
    except Exception as e:
        logger.error(f"Error in get_user_history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

@history_router.delete("/{idiom_id}", response_model=Dict[str, str])
async def delete_user_history(idiom_id: str, user: User = Depends(get_current_user)):
    try:
        idiom = await Idiom.find_one(Idiom.id == PydanticObjectId(idiom_id), Idiom.user_id == PydanticObjectId(user.id))
        if not idiom:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Idiom not found in user history"
            )
        await idiom.delete()
        return {"message": "Idiom deleted from user history"}
    except Exception as e:
        logger.error(f"Error in delete_user_history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

@history_router.put("/{idiom_id}", response_model=IdiomResponse)
async def update_user_history(idiom_id: str, idiom_data: Idiom, user: User = Depends(get_current_user)):
    try:
        idiom = await Idiom.find_one(Idiom.id == PydanticObjectId(idiom_id), Idiom.user_id == PydanticObjectId(user.id))
        if not idiom:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Idiom not found in user history"
            )
        await idiom.update({"$set": idiom_data.dict(exclude_unset=True)})
        updated_idiom = await Idiom.get(PydanticObjectId(idiom_id))
        return IdiomResponse(**updated_idiom.dict())
    except Exception as e:
        logger.error(f"Error in update_user_history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )