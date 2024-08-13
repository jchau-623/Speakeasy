import logging
import traceback
from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import List, Dict, Union
from models.idiom import Idiom, IdiomResponse
from models.slang import Slang, SlangResponse
from models.user import User
from uuid import UUID
from databases.connection import Database
from beanie import PydanticObjectId
from auth.authenticate import authenticate

history_router = APIRouter(tags=["History"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@history_router.get("/", response_model=Dict[str, List[Union[IdiomResponse, SlangResponse]]])
async def get_user_history(user_id: str = Query(..., alias="user_id")):
    try:
        logger.info(f"Fetching idioms and slangs for user_id: {user_id}")

        # Fetch idioms for the given user_id
        idioms = await Idiom.find(Idiom.user_id == user_id).to_list()
        logger.info(f"Fetched idioms: {idioms}")
        # print(f"Idioms: {idioms}")

        # Fetch slangs for the given user_id
        slangs = await Slang.find(Slang.user_id == user_id).to_list()
        logger.info(f"Fetched slangs: {slangs}")
        # print(f"Slangs: {slangs}")

        # Combine idioms and slangs
        history = idioms + slangs
        logger.info(f"Combined history: {history}")

        # Return the fetched history as is, without modifying the _id
        return {"history": [IdiomResponse(**item.dict()) if isinstance(item, Idiom) else SlangResponse(**item.dict()) for item in history]}
    except Exception as e:
        logger.error(f"Error in get_user_history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )


@history_router.delete("/delete_history", response_model=Dict[str, str])
async def delete_user_history(history_item: SlangResponse | IdiomResponse,
    current_user_email: str = Depends(authenticate)
) -> Dict[str, str]:
    """Delete a history item for the current user"""
    db = Database(User)
    user = await db.get_by_email(current_user_email)
    if user is None:
        raise HTTPException(
        )
      # Fetch idioms for the given user_id
    idioms = await Idiom.find(Idiom.user_id == user.id).to_list()
    logger.info(f"Fetched idioms: {idioms}")

        # Fetch slangs for the given user_id
    slangs = await Slang.find(Slang.user_id == user.id).to_list()
    logger.info(f"Fetched slangs: {slangs}")

        # Combine idioms and slangs
    history = idioms + slangs

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if history_item in history:
        history.remove(history_item)
        await history.save()
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="History item not found"
    )


@history_router.put("/", response_model=Union[IdiomResponse, SlangResponse])
async def update_user_history(term: str, item_data: Union[Idiom, Slang], user_id: str):
    try:
        # Search by term or idiom
        idiom = await Idiom.find_one({"idiom": term, "user_id": user_id})
        if idiom:
            await idiom.update({"$set": item_data.dict(exclude_unset=True)})
            updated_idiom = await Idiom.get(idiom.id)
            logger.info(f"Updated idiom: {term} for user_id: {user_id}")
            return IdiomResponse(**updated_idiom.dict())

        slang = await Slang.find_one({"term": term, "user_id": user_id})
        if slang:
            await slang.update({"$set": item_data.dict(exclude_unset=True)})
            updated_slang = await Slang.get(slang.id)
            logger.info(f"Updated slang: {term} for user_id: {user_id}")
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