import openai
from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.slang import Slang, SlangCreate, SlangResponse
from databases.connection import Database, Settings
import logging


settings = Settings()
openai.api_key = settings.OPENAI_API_KEY



search_router = APIRouter()

slang_database = Database(Slang)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def get_chatgpt_response(prompt: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-1106",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message["content"].strip()

async def detect_language(term: str) -> str:
    prompt = f"Detect the language of the following term: '{term}'. Provide the language name."
    response = await get_chatgpt_response(prompt)
    return response

@search_router.get("/", response_model=List[SlangResponse])
async def search(term: str = Query(..., min_length=1), user_id: str = Query(...)):
    try:
        term_lower = term.strip().lower()

        # Fetch slangs with the given term and user_id
        slangs = await Slang.find(Slang.term == term_lower, Slang.user_id == user_id).to_list()

        # If slangs list is empty, proceed with creating a new entry
        if not slangs:
            logger.info(f"No existing slang found for term '{term_lower}' and user_id '{user_id}'. Generating new slang.")
            
            # Proceed with logic to create and insert a new slang (not shown here)
            
            # Ensure the new slang is inserted correctly

        logger.info(f"Returning existing slang for term '{term_lower}' and user_id '{user_id}'.")
        return [SlangResponse(**slang.dict(by_alias=True)) for slang in slangs]

    except Exception as e:
        logger.error("Error searching term: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")
