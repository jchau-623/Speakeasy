from fastapi import APIRouter, HTTPException, status
from beanie import PydanticObjectId
from models.translation import Translation, TranslationResponse

translation_router = APIRouter(
    tags=["Translation"]
)

@translation_router.post("/", response_model=TranslationResponse)
async def create_translation(translation: Translation) -> Translation:
    translation_exist = await Translation.find_one(Translation.idiom_id == translation.idiom_id and Translation.slang_id == translation.slang_id)
    if translation_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Translation already exists"
        )

    await translation.insert()
    return translation


@translation_router.get("/{translation_id}", response_model=TranslationResponse)
async def get_translation(translation_id: PydanticObjectId) -> Translation:
    translation = await Translation.get(translation_id)
    if not translation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Translation not found"
        )
    return translation


@translation_router.put("/{translation_id}", response_model=TranslationResponse)
async def update_translation(translation_id: PydanticObjectId, translation_data: Translation) -> Translation:
    translation = await Translation.get(translation_id)
    if not translation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Translation not found"
        )

    await translation.update({"$set": translation_data.dict()})
    return translation


@translation_router.delete("/{translation_id}")
async def delete_translation(translation_id: PydanticObjectId) -> dict:
    translation = await Translation.get(translation_id)
    if not translation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Translation not found"
        )

    await translation.delete()
    return {
        "message": "Translation deleted successfully"
    }
