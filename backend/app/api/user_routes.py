from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from auth.hash_password import HashPassword
from auth.jwt_handler import create_access_token, verify_access_token
from auth.authenticate import authenticate
from databases.connection import Database
from models.user import User, TokenResponse, UserResponse, MessageResponse
from typing import List
# import pytest

user_router = APIRouter(
    tags=["User"]
)

user_database = Database(User)
hash_password = HashPassword()


token_blacklist: List[str] = [] #logout for dev only


@user_router.post("/signup", response_model=UserResponse)
async def sign_new_user(user: User, response: Response) -> UserResponse:
    user_exist = await User.find_one(User.email == user.email)
    if user_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User email already exists"
        )

    hashed_password = hash_password.create_hash(user.password)
    user.password = hashed_password

    await user_database.save(user)

    db = Database(User)
    new_user = await db.get_by_email(user.email)
    access_token = create_access_token(user.email)
    if new_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True)

    user_response = UserResponse(
        id=new_user.id,
        email=new_user.email,
        favorite=new_user.favorite
    )

    return user_response


@user_router.post("/signin", response_model=UserResponse)
async def sign_user_in(response: Response, user: OAuth2PasswordRequestForm = Depends()) -> UserResponse:
    user_exist = await User.find_one(User.email == user.username)
    if not user_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not exist"
        )
    if hash_password.verify_hash(user.password, user_exist.password):
        access_token = create_access_token(user_exist.email)
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True)
        user_response = UserResponse(
            id=user_exist.id,
            email=user_exist.email,
            favorite=user_exist.favorite
        )
        return user_response

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid password.")
    

@user_router.get("/", response_model=User)
async def get_user(request: Request, current_user_email: str = Depends(authenticate)) -> User:
    """Get current user"""
    db = Database(User)
    user = await db.get_by_email(current_user_email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@user_router.delete("/", response_model=MessageResponse)
async def delete_user(current_user_email: str = Depends(authenticate)) -> MessageResponse:
    """Delete current user"""
    db = Database(User)
    user = await db.get_by_email(current_user_email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    await user.delete()
    return MessageResponse(message="User deleted successfully.")


@user_router.post("/logout")
async def logout_user(request: Request, response: Response, current_user_email: str = Depends(authenticate)) -> dict:
    """Logout current user"""
    token = request.cookies.get("access_token")
    if token:
        token_blacklist.append(token)
        response.delete_cookie(key="access_token")
    return {"message": "User logged out successfully"}
