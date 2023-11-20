from datetime import timedelta

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.applications.users.models import ShortTgToken, User
from app.applications.users.schemas import BaseUserCreate

from app.core.auth.schemas import JWTToken, TelegramLoginData, TgToken, CredentialSchema
from app.core.auth.utils.contrib import authenticate_tg, authenticate
from app.core.auth.utils.jwt import create_access_token
from app.settings.config import settings
from app.core.auth.utils import password
from app.redis.requests.core.requests import load_short_token, get_short_token
from app.redis.requests.core.schemas import ShortToken

import aiohttp, asyncio

import random
import string

router = APIRouter()

members_url = f"https://api.telegram.org/bot{settings.BOT_TOKEN_CONT}/getChatMember"
async def members_list_request(session, body):
    try:
        async with session.post(url=members_url, data=body) as response:
            return await response
    except BaseException:
        raise HTTPException(status_code=404, detail="The user with this username does not exist in this group")

async def members_task(data):
    async with aiohttp.ClientSession() as session:
        task = members_list_request(session, data)
        return await asyncio.gather(task)

@router.post("/access-token", response_model=JWTToken)
async def login_access_token(credentials: OAuth2PasswordRequestForm = Depends()):
    credentials = CredentialSchema(username=credentials.username, token=credentials.password)

    user = await authenticate(credentials)

    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or auth token")
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)

    return {
        "access_token": create_access_token(data={"user_uuid": str(user.uuid)}, expires_delta=access_token_expires),
        "token_type": "bearer",
    }
    

@router.post("/telegram/generate-token", response_model=TgToken, status_code=200)
async def generate_token(
    telegram_data: TelegramLoginData
):
    user = await authenticate_tg(telegram_data)

    if not user:
        print(user, "pizdets")
        user_db = BaseUserCreate(**telegram_data.model_dump())
        await User.create(user_db)
        # raise HTTPException(status_code=400, detail="Incorrect telegram data or hash")

    await members_task({"chat_id": -1001962883451, "user_id": telegram_data.id})

    token = "".join([random.choice(string.ascii_letters) for _ in range(32)])
    token_hashed = password.get_password_hash(token)

    await load_short_token(ShortToken(username=user.username, short_token=token_hashed))

    # tg_token = await ShortTgToken.get_or_none(user=user)
    # if tg_token is None:
    #     tg_token = await ShortTgToken(value=token_hashed, user=user)
    # else:
    #     tg_token.update_from_dict({"value": token_hashed})
    # await tg_token.save()



    return TgToken(username=user.username, short_token=token)
