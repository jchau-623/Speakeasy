import openai
from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.slang import Slang, SlangCreate, SlangResponse
from models.idiom import Idiom, IdiomResponse
from databases.connection import Database, Settings
import logging


settings = Settings()
openai.api_key = settings.OPENAI_API_KEY



search_router = APIRouter()

slang_database = Database(Slang)
idiom_database = Database(Idiom)

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
from typing import Union

@search_router.get("/", response_model=Union[SlangResponse, IdiomResponse])
async def search(term: str = Query(..., min_length=1), user_id: str = Query(...)):
    try:
        # Ensure the term is converted to lowercase
        term_lower = term.lower()
        words = term_lower.split()
        
        if len(words) == 1:
            # Handle slang terms
            slang = await slang_database.model.find_one(Slang.term == term_lower)
            print(term , 66666666)
            if not slang:
                # Detect the language of the term
                detected_language = await detect_language(term_lower)
                logger.info(f"Detected language: {detected_language}")

                # Prepare prompts for each required field
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

                # Create a new slang object
                new_slang = Slang(
                    term=term_lower,
                    meaning=result["meaning"],
                    origin=result["origin"],
                    exampleUse=result["exampleUse"],
                    equivalentInLanguage=result["equivalentInLanguage"],
                    user_id=user_id
                )
                await new_slang.insert()
                return SlangResponse(**new_slang.dict(by_alias=True))
            else:
                return SlangResponse(**slang.dict(by_alias=True))

        elif len(words) > 1:
            # Handle idiom terms
            idiom = await idiom_database.model.find_one(Idiom.idiom == term_lower)
            if not idiom:
                # Detect the language of the term
                detected_language = await detect_language(term_lower)
                logger.info(f"Detected language: {detected_language}")

                # Prepare prompts for each required field
                prompts = {
                    "meaning": f"Define the idiom '{term_lower}' and provide its meaning.",
                    "origin": f"Explain the origin of the idiom '{term_lower}'.",
                    "exampleUse": f"Provide an example use of the idiom '{term_lower}'.",
                    "equivalentInLanguage": f"Is there an equivalent of the idiom '{term_lower}' in other languages? If so, what is it?"
                }

                # Extract information using the prompts
                result = {
                    "meaning": await get_chatgpt_response(prompts["meaning"]),
                    "origin": await get_chatgpt_response(prompts["origin"]),
                    "exampleUse": await get_chatgpt_response(prompts["exampleUse"]),
                    "equivalentInLanguage": await get_chatgpt_response(prompts["equivalentInLanguage"])
                }

                # Create a new idiom object
                new_idiom = Idiom(
                    idiom=term_lower,
                    meaning=result["meaning"],
                    origin=result["origin"],
                    exampleUse=result["exampleUse"],
                    equivalentInLanguage=result["equivalentInLanguage"],
                    user_id=user_id
                )
                await new_idiom.insert()
                return IdiomResponse(**new_idiom.dict(by_alias=True))
            else:
                return IdiomResponse(**idiom.dict(by_alias=True))
        else:
            raise HTTPException(status_code=422, detail="Invalid input format. Term must contain one or more words.")
    
    except Exception as e:
        logger.error("Error searching term: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")
