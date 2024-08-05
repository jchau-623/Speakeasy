import logging
from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Union
from models.idiom import Idiom, IdiomResponse
from models.slang import Slang, SlangResponse
from models.user import User
from beanie import PydanticObjectId

history_router = APIRouter(tags=["History"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@history_router.get("/", response_model=Dict[str, List[Union[IdiomResponse, SlangResponse]]])
async def get_user_history(user_id: str):
    try:
        logger.info(f"Fetching idioms and slangs for user_id: {user_id}")
        idioms = await Idiom.find(Idiom.user_id == PydanticObjectId(user_id)).to_list()
        slangs = await Slang.find(Slang.user_id == PydanticObjectId(user_id)).to_list()
        
        history = idioms + slangs
        
        if not history:
            logger.info(f"No idioms or slangs found for user_id: {user_id}")
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
async def delete_user_history(item_id: str, user_id: str):
    try:
        idiom = await Idiom.find_one(Idiom.id == PydanticObjectId(item_id), Idiom.user_id == PydanticObjectId(user_id))
        if idiom:
            await idiom.delete()
            logger.info(f"Deleted idiom: {item_id} from user_id: {user_id}")
            return {"message": "Idiom deleted from user history"}

        slang = await Slang.find_one(Slang.id == PydanticObjectId(item_id), Slang.user_id == PydanticObjectId(user_id))
        if slang:
            await slang.delete()
            logger.info(f"Deleted slang: {item_id} from user_id: {user_id}")
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
async def update_user_history(item_id: str, item_data: Union[IdiomCreate, SlangCreate], user_id: str):
    try:
        idiom = await Idiom.find_one(Idiom.id == PydanticObjectId(item_id), Idiom.user_id == PydanticObjectId(user_id))
        if idiom:
            await idiom.update({"$set": item_data.dict(exclude_unset=True)})
            updated_idiom = await Idiom.get(PydanticObjectId(item_id))
            logger.info(f"Updated idiom: {item_id} for user_id: {user_id}")
            return IdiomResponse(**updated_idiom.dict())

        slang = await Slang.find_one(Slang.id == PydanticObjectId(item_id), Slang.user_id == PydanticObjectId(user_id))
        if slang:
            await slang.update({"$set": item_data.dict(exclude_unset=True)})
            updated_slang = await Slang.get(PydanticObjectId(item_id))
            logger.info(f"Updated slang: {item_id} for user_id: {user_id}")
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
