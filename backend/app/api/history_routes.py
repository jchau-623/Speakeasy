import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Dict, Union
from auth.jwt_handler import verify_access_token
from models.idiom import Idiom, IdiomResponse, IdiomCreate
from models.slang import Slang, SlangResponse, SlangCreate
from models.user import User
from beanie import PydanticObjectId

history_router = APIRouter(tags=["History"])

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

@history_router.get("/", response_model=Dict[str, List[Union[IdiomResponse, SlangResponse]]])
async def get_user_history(user: User = Depends(get_current_user)):
    try:
        logger.info(f"Fetching idioms and slangs for user_id: {user.id}")
        idioms = await Idiom.find(Idiom.user_id == PydanticObjectId(user.id)).to_list()
        slangs = await Slang.find(Slang.user_id == PydanticObjectId(user.id)).to_list()
        
        history = idioms + slangs
        
        if not history:
            logger.info(f"No idioms or slangs found for user_id: {user.id}")
            return {"history": []}
        
        logger.info(f"Found idioms and slangs: {history}")
        return {"history": [IdiomResponse(**item.dict()) if isinstance(item, Idiom) else SlangResponse(**item.dict()) for item in history]}
    except Exception as e:
        logger.error(f"Error in get_user_history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

@history_router.delete("/{item_id}", response_model=Dict[str, str])
async def delete_user_history(item_id: str, user: User = Depends(get_current_user)):
    try:
        idiom = await Idiom.find_one(Idiom.id == PydanticObjectId(item_id), Idiom.user_id == PydanticObjectId(user.id))
        if idiom:
            await idiom.delete()
            logger.info(f"Deleted idiom: {item_id} from user_id: {user.id}")
            return {"message": "Idiom deleted from user history"}

        slang = await Slang.find_one(Slang.id == PydanticObjectId(item_id), Slang.user_id == PydanticObjectId(user.id))
        if slang:
            await slang.delete()
            logger.info(f"Deleted slang: {item_id} from user_id: {user.id}")
            return {"message": "Slang deleted from user history"}

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in user history"
        )
    except Exception as e:
        logger.error(f"Error in delete_user_history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

@history_router.put("/{item_id}", response_model=Union[IdiomResponse, SlangResponse])
async def update_user_history(item_id: str, item_data: Union[IdiomCreate, SlangCreate], user: User = Depends(get_current_user)):
    try:
        idiom = await Idiom.find_one(Idiom.id == PydanticObjectId(item_id), Idiom.user_id == PydanticObjectId(user.id))
        if idiom:
            await idiom.update({"$set": item_data.dict(exclude_unset=True)})
            updated_idiom = await Idiom.get(PydanticObjectId(item_id))
            logger.info(f"Updated idiom: {item_id} for user_id: {user.id}")
            return IdiomResponse(**updated_idiom.dict())

        slang = await Slang.find_one(Slang.id == PydanticObjectId(item_id), Slang.user_id == PydanticObjectId(user.id))
        if slang:
            await slang.update({"$set": item_data.dict(exclude_unset=True)})
            updated_slang = await Slang.get(PydanticObjectId(item_id))
            logger.info(f"Updated slang: {item_id} for user_id: {user.id}")
            return SlangResponse(**updated_slang.dict())

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in user history"
        )
    except Exception as e:
        logger.error(f"Error in update_user_history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )