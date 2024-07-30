import time
from datetime import datetime, timezone
from fastapi import HTTPException, status
from jose import jwt, JWTError
from databases.connection import Settings

settings = Settings()

def create_access_token(user: str) -> str:
    payload = {
        "user": user,
        "expires": time.time() + 3600
    }
    
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
 
    return token


def verify_access_token(token: str) -> dict:
    try:
        data = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")

        expire = data.get("expires")

        if expire is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No access token supplied"
            )

        now_utc = datetime.now(timezone.utc)
        expire_utc = datetime.fromtimestamp(expire, timezone.utc)

        if now_utc > expire_utc:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token expired!"
            )

        return data

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
