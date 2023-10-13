from datetime import datetime, timedelta

from pydantic import UUID4

from app.core.auth.utils.contrib import get_current_admin, get_current_user
from app.core.auth.utils.password import get_password_hash

from app.applications.users.models import User, ShortTgToken
from app.applications.users.schemas import BaseUserOut, BaseUserCreate, BaseUserUpdate, TgToken, TgTokenWithId


from app.core.auth.schemas import JWTToken
from app.core.auth.utils.jwt import create_access_token
from app.settings.config import settings

from typing import List

from fastapi import APIRouter, Depends, HTTPException

import logging
import string
import random

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=List[BaseUserOut], status_code=200)
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin)
):
    users = User.all().limit(limit=limit).offset(skip)
    return users


@router.post("/", response_model=BaseUserOut, status_code=201)
async def create_user(
    *,
    user_in: BaseUserCreate
):
    user = await User.get_by_email(email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email alredady exists",
        )
    
    hashed_password = get_password_hash(password=user_in.password)
    db_user = BaseUserCreate(**user_in.model_dump(), hashed_password=hashed_password)
    created_user = await User.create(db_user)
    return created_user


@router.patch("/me", response_model=BaseUserOut, status_code=200)
async def update_user_me(user_in: BaseUserUpdate, current_user: User = Depends(get_current_user)):
    if user_in.password is not None:
        hashed_password = get_password_hash(user_in.password)
        current_user.password_hash = hashed_password
    if user_in.email is not None:
        current_user.email = user_in.email
    
    await current_user.save()
    return current_user


@router.delete("/me/tg_id", response_model=BaseUserOut, status_code=200)
async def delete_user_me_tg_id(current_user: User = Depends(get_current_user)):
    current_user.tg_id = None
    current_user.save()
    return current_user


@router.get("/me", response_model=BaseUserOut, status_code=200)
def read_user_me(current_user: User = Depends(get_current_user)):
        return current_user


@router.get("/{uuid}", response_model=BaseUserOut, status_code=200)
async def read_by_user_uuid(
     uuid: UUID4,
     current_user: User = Depends(get_current_admin)
):
     user = await User.get(uuid=uuid)

     if not user:
          raise HTTPException(
               status_code=404,
               detail="The user with this uuid does not exist",
          )
     
     return user


@router.patch("/{uuid}", response_model=BaseUserOut, status_code=200)
async def update_user(
     uuid: UUID4,
     user_in: BaseUserUpdate,
     current_user: User = Depends(get_current_admin),
):
    user = await User.get(uuid=uuid)
    if not user:
         raise HTTPException(
              status_code=404,
              detail="The user with this uuid does not exist",
         )
    user = await User.update_from_dict(user_in.model_dump())
    await user.save()

    return user


@router.get("/telegram/generate-token", response_model=TgToken, status_code=200)
async def generate_token(
    current_user: User = Depends(get_current_user)
):
     token = "".join([random.choise(string.ascii_letters) for _ in range(32)])
     tg_token = await ShortTgToken(value=token, user=current_user)
     await tg_token.save()

     return TgToken(token=token)


@router.post("/telegram/get_jwt", response_model=JWTToken, status_code=200)
async def generate_jwt_by_short_token(tg_token_in: TgTokenWithId):
    tg_token = await ShortTgToken.filter(value=tg_token_in.token).prefetch_related("User").first()

    if tg_token is None:
        raise HTTPException(
            status_code=404,
            detail="Wrong token",
        )
     
    user = tg_token.user
    
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)

    user.tg_id = tg_token_in.id
    await user.save()

    await tg_token.delete()

    return {
        "access_token": create_access_token(data={"user_id": str(user.uuid)}, expires_delta=access_token_expires),
        "token_type": "bearer",
    }
     