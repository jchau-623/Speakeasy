import logging
from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Dict, Union
from models.idiom import Idiom, IdiomResponse
from models.slang import Slang, SlangResponse
from uuid import UUID
from beanie import PydanticObjectId

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

        # Fetch slangs for the given user_id
        slangs = await Slang.find(Slang.user_id == user_id).to_list()
        logger.info(f"Fetched slangs: {slangs}")

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


@history_router.delete("/{item_id}", response_model=Dict[str, str])
async def delete_user_history(item_id: UUID, user_id: str = Query(...)):
    try:
        item_id_str = str(item_id)
        print(f"Deleting item with ID: {item_id_str} for user: {user_id}")

        # Attempt to find and delete an idiom or slang by its UUID and user_id
        item = await Idiom.find_one(Idiom.id == item_id_str, Idiom.user_id == user_id) or \
               await Slang.find_one(Slang.id == item_id_str, Slang.user_id == user_id)

        if item:
            await item.delete()
            print(f"Successfully deleted item with ID: {item_id_str}")
            return {"message": "Item deleted from user history"}

        # If the item was not found, raise a 404 error
        print(f"Item not found with ID: {item_id_str} for user: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in user history"
        )
    except Exception as e:
        print(f"Error during deletion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@history_router.put("/{item_id}", response_model=Union[IdiomResponse, SlangResponse])
async def update_user_history(item_id: str, item_data: Union[Idiom, Slang], user_id: str):
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
