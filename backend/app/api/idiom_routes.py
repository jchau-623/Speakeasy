import openai
from fastapi import APIRouter, HTTPException, status
from models.idiom import Idiom, IdiomCreate, IdiomResponse
from databases.connection import Database, Settings
from typing import List
from uuid import UUID
import logging

settings = Settings()
openai.api_key = settings.OPENAI_API_KEY

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

idiom_router = APIRouter(tags=["Idiom"])

database = Database(Idiom)

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

@idiom_router.post("/", response_model=IdiomResponse)
async def create_idiom(idiom: IdiomCreate):
    try:
        # Ensure the idiom is in a consistent format (e.g., lowercase and stripped of extra spaces)
        idiom_lower = idiom.idiom.strip().lower()

        # Check if an idiom with the same term and user_id already exists
        existing_idiom = await Idiom.find_one(Idiom.idiom == idiom_lower, Idiom.user_id == idiom.user_id)
        if existing_idiom:
            return IdiomResponse(**existing_idiom.dict(by_alias=True))

        # Detect the language of the idiom
        detected_language = await detect_language(idiom_lower)
        logger.info(f"Detected language: {detected_language}")

        # Prepare prompts for each required field
        prompts = {
            "meaning": f"Define the idiom '{idiom_lower}' and provide its meaning.",
            "origin": f"Explain the origin of the idiom '{idiom_lower}'.",
            "exampleUse": f"Provide an example use of the idiom '{idiom_lower}'.",
            "equivalentInLanguage": f"Is there an equivalent of the idiom '{idiom_lower}' in other languages? If so, what is it?"
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

        # Create a new idiom object
        new_idiom = Idiom(
            idiom=idiom_lower,
            meaning=result["meaning"],
            origin=result["origin"],
            exampleUse=result["exampleUse"],
            equivalentInLanguage=result["equivalentInLanguage"],
            user_id=idiom.user_id
        )
        await new_idiom.insert()

        return IdiomResponse(**new_idiom.dict(by_alias=True))

    except Exception as e:
        logger.error("Error creating idiom: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@idiom_router.get("/", response_model=List[IdiomResponse])
async def get_idioms():
    try:
        idioms = await Idiom.find_all().to_list()
        logger.info(f"Fetched idioms: {idioms}")
        return [IdiomResponse(**idiom.dict(by_alias=True)) for idiom in idioms]
    except Exception as e:
        logger.error("Error fetching idioms: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@idiom_router.get("/{id}", response_model=IdiomResponse)
async def get_idiom(id: UUID):
    try:
        idiom = await Idiom.get(id)
        if not idiom:
            raise HTTPException(status_code=404, detail="Idiom not found")

        return IdiomResponse(**idiom.dict(by_alias=True))
    except Exception as e:
        logger.error("Error fetching idiom: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@idiom_router.put("/{id}", response_model=IdiomResponse)
async def update_idiom(id: UUID, idiom_data: IdiomCreate):
    try:
        idiom = await Idiom.find_one(Idiom.id == id)
        if not idiom:
            raise HTTPException(status_code=404, detail="Idiom not found")

        update_data = idiom_data.dict(exclude_unset=True)

        await idiom.update({"$set": update_data})
        updated_idiom = await Idiom.get(id)
        return IdiomResponse(**updated_idiom.dict(by_alias=True))

    except Exception as e:
        logger.error("Error updating idiom: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@idiom_router.delete("/{id}")
async def delete_idiom(id: UUID):
    try:
        idiom = await Idiom.find_one(Idiom.id == id)
        if not idiom:
            raise HTTPException(status_code=404, detail="Idiom not found")

        await idiom.delete()
        return {"message": "Idiom deleted successfully"}

    except Exception as e:
        logger.error("Error deleting idiom: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")
