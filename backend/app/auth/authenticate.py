from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from typing import List

from auth.jwt_handler import verify_access_token
from typing import List


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/signin")

token_blacklist: List[str] = [] #log out for dev only

# async def authenticate(token: str = Depends(oauth2_scheme)) -> str:
#     if not token:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Sign in for access"
#         )

#     decoded_token = verify_access_token(token)
#     return decoded_token["user"]

async def authenticate(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token or token in token_blacklist:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked or missing"
        )
    payload = verify_access_token(token)
    return payload["user"]
