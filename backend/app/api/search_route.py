from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.slang import Slang, SlangResponse
# from models.idiom import Idiom, IdiomResponse
from databases.connection import Database
import logging

search_router = APIRouter()

slang_database = Database(Slang)
# idiom_database = Database(Idiom)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@search_router.get("/", response_model=List[SlangResponse])
async def search(term: str = Query(..., min_length=1)):
    try:
        words = term.split()
        if len(words) == 1:
            # It's a slang
            slangs = await slang_database.model.find(Slang.term.lower() == term).to_list()
            if not slangs:
                return []
            return [SlangResponse(**slang.dict(by_alias=True)) for slang in slangs]
        # else:
        #     # It's an idiom
        #     idioms = await idiom_database.model.find(Idiom.term == term).to_list()
        #     if not idioms:
        #         return []
        #     return [IdiomResponse(**idiom.dict(by_alias=True)) for idiom in idioms]
    except Exception as e:
        logger.error("Error searching term: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")
