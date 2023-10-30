from datetime import timedelta

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.applications.users.models import ShortTgToken

from app.core.auth.schemas import JWTToken, TelegramLoginData, TgToken, CredentialSchema
from app.core.auth.utils.contrib import authenticate_tg, authenticate
from app.core.auth.utils.jwt import create_access_token
from app.settings.config import settings
from app.core.auth.utils import password

import random
import string

router = APIRouter()


@router.post("/access-token", response_model=JWTToken)
async def login_access_token(credentials: OAuth2PasswordRequestForm = Depends()):
    credentials = CredentialSchema(username=credentials.username, token=credentials.password)

    user = await authenticate(credentials)

    if not user:
        raise HTTPException(status_code=400, detail="Incorrect telegram data or hash")
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
        raise HTTPException(status_code=400, detail="Incorrect telegram data or hash")

    token = "".join([random.choice(string.ascii_letters) for _ in range(32)])
    token_hashed = password.get_password_hash(token)
    tg_token = await ShortTgToken(value=token_hashed, user=user)
    await tg_token.save()

    return TgToken(username=user.username, short_token=token)
