import time
from datetime import datetime, timezone
from fastapi import HTTPException, status
from jose import jwt, JWTError
from databases.connection import Settings
#update line 6 - line10
import logging #leslie  

logging.basicConfig(level=logging.DEBUG) #leslie
logger = logging.getLogger(__name__) #leslie

settings = Settings()

def create_access_token(user: str) -> str:
    payload = {
        "user": user,
        "expires": time.time() + 3600
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    #update
    logger.debug(f"Created token: {token}") #leslie

    return token


def verify_access_token(token: str) -> dict:
    try:
        logger.debug(f"Verifying token: {token}") #leslie
        data = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")
        logger.debug(f"Decoded data: {data}") #leslie

        expire = data.get("expires")
        logger.debug(f"Token expiration time: {expire}") #leslie

        if expire is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No access token supplied"
            )

        now_utc = datetime.now(timezone.utc)
        expire_utc = datetime.fromtimestamp(expire, timezone.utc)
        logger.debug(f"Current time (UTC): {now_utc}") #leslie
        logger.debug(f"Token expiration time (UTC): {expire_utc}") #leslie

        if now_utc > expire_utc:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token expired!"
            )

        return data

    # except JWTError:
    except JWTError as e: #leslie
        logger.error(f"JWTError: {e}") #leslie
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
