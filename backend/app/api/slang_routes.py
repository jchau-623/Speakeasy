import openai
from fastapi import APIRouter, HTTPException
from models.slang import Slang, SlangCreate, SlangResponse
from databases.connection import Database, Settings
from typing import List
from uuid import UUID
import logging
import re

settings = Settings()
openai.api_key = settings.OPENAI_API_KEY

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

slang_router = APIRouter()

database = Database(Slang)

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



@slang_router.post("/", response_model=SlangResponse)
async def create_slang(slang: SlangCreate):
    try:
        # Ensure the term is in a consistent format (e.g., lowercase and stripped of extra spaces)
        term_lower = slang.term.strip().lower()

        # Check if a slang with the same term and user_id already exists
        existing_slang = await Slang.find_one(Slang.term == term_lower, Slang.user_id == slang.user_id)
        if existing_slang:
            return SlangResponse(**existing_slang.dict(by_alias=True))
      
        # Detect the language of the term (continue with the rest of the logic)
        detected_language = await detect_language(term_lower)
        logger.info(f"Detected language: {detected_language}")
      
        # Prepare prompts and create a new slang object (as before)
        prompts = {
            "meaning": f"Define the slang term '{term_lower}' and provide its meaning.",
            "origin": f"Explain the origin of the slang term '{term_lower}'.",
            "exampleUse": f"Provide an example use of the slang term '{term_lower}'.",
            "equivalentInLanguage": f"Is there an equivalent of the slang term '{term_lower}' in other languages? If so, what is it?"
        }

        # Extract information using the prompts
        result = {
            "meaning": await get_chatgpt_response(prompts["meaning"]),
            "origin": await get_chatgpt_response(prompts["origin"]),
            "exampleUse": await get_chatgpt_response(prompts["exampleUse"]),
            "equivalentInLanguage": await get_chatgpt_response(prompts["equivalentInLanguage"])
        }

        # Default responses in case of missing information
        result = {
            "meaning": result["meaning"] or "No meaning provided",
            "origin": result["origin"] or "No origin provided",
            "exampleUse": result["exampleUse"] or "No example use provided",
            "equivalentInLanguage": result["equivalentInLanguage"] or None
        }
       
        # Create and insert a new slang object
        new_slang = Slang(
            term=term_lower,
            meaning=result["meaning"],
            origin=result["origin"],
            exampleUse=result["exampleUse"],
            equivalentInLanguage=result["equivalentInLanguage"],
            user_id=slang.user_id
        )
        await new_slang.insert()
       
        return SlangResponse(**new_slang.dict(by_alias=True))
        
    except Exception as e:
        logger.error("Error creating slang: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@slang_router.get("/", response_model=List[SlangResponse])
async def get_slangs():
    try:
    
        slangs = await Slang.find_all().to_list()
        logger.info(f"Fetched slangs: {slangs}")
        return [SlangResponse(**slang.dict(by_alias=True)) for slang in slangs]
    except Exception as e:
        logger.error("Error fetching slangs: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    


@slang_router.get("/{id}", response_model=SlangResponse) 
async def get_slang(id: UUID):
    try:
        slang = await Slang.get(id)
        if not slang:
            raise HTTPException(status_code=404, detail="Slang not found")
        
        
        # logger.info(f"Fetched slang: {slang.dict(by_alias=True)}")
        
        return SlangResponse(**slang.dict(by_alias=True))
    except Exception as e:
        logger.error("Error fetching slang: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")



# @slang_router.put("/{id}", response_model=SlangResponse)
# async def update_slang(id: UUID, slang: SlangCreate):
#     updated_slang = await database.update(id, slang)
#     if not updated_slang:
#         raise HTTPException(status_code=404, detail="Slang not found")
#     return SlangResponse(**updated_slang.dict(by_alias=True))

# @slang_router.delete("/{id}", response_model=bool)
# async def delete_slang(id: UUID):
#     deleted = await database.delete(id)
#     if not deleted:
#         raise HTTPException(status_code=404, detail="Slang not found")
#     return True

 