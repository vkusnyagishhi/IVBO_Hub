import logging
import hmac
import hashlib
from typing import Optional

import jwt
import aiohttp, asyncio
from fastapi import HTTPException, Security
from fastapi.security import OAuth2PasswordBearer

from starlette.status import HTTP_403_FORBIDDEN

from app.applications.users.models import User, ShortTgToken
from app.core.auth.schemas import JWTTokenPayload, TelegramLoginData, CredentialSchema
from app.core.auth.utils import password
from app.core.auth.utils.jwt import ALGORITHM
from app.settings.config import settings
from app.redis.requests.core.requests import load_short_token, get_short_token, delete_short_token

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login/access-token")


async def get_current_user(token: str = Security(reusable_oauth2)) -> Optional[User]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        token_data = JWTTokenPayload(**payload)
    except jwt.PyJWTError:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Could not validate credentials")
    
    user = await User.filter(uuid=token_data.user_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


async def get_current_admin(current_user: User = Security(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=400, detail="The user does not have enough privileges")
    
    return current_user


async def authenticate(credentials: CredentialSchema) -> Optional["User"]:
    if credentials.username:
        user = await User.get_by_tg_username(username=credentials.username)
        # token = await ShortTgToken.get_or_none(user=user)
        token_redis = await get_short_token(username=credentials.username)
    else:
        return None
    
    if user is None or token_redis is None:
        return None

    verified, updated_token = password.verify_and_update_password(credentials.token, token_redis.short_token)

    if not verified:
        return None
    
    await delete_short_token(credentials.username)

    return user


def validate(data: TelegramLoginData, secret_key: str) -> bool:
    telegram_data = data.dict(
        exclude_unset=True,
        exclude_none=True,
        exclude_defaults=True
    )
    data_check_string = '\n'.join(sorted([
        f"{key}={value or 'null'}"
        for key, value in telegram_data.items()
        if key != 'hash' and value is not None
    ]))
    secret_key = hashlib.sha256(secret_key.encode()).digest()
    calculated_hash = hmac.new(
        secret_key,
        msg=data_check_string.encode(),
        digestmod=hashlib.sha256
    ).hexdigest()

    return data.hash == calculated_hash


async def authenticate_tg(credentials: TelegramLoginData) -> Optional[User]:
    if credentials.username:
        user = await User.get_by_tg_username(username=credentials.username)
    else:
        return None

    if user is None:
        user = await User.create(credentials)

    verified = validate(credentials, settings.BOT_TOKEN)

    if verified:
        return user
    return None

members_url = f"https://api.telegram.org/bot{settings.BOT_TOKEN_CONT}/getChatMember"
async def members_list_request(session, body):
    try:
        async with session.post(url=members_url, data=body) as response:
            return response
    except BaseException:
        raise HTTPException(status_code=404, detail="The user with this username does not exist in this group")

async def members_task(data):
    async with aiohttp.ClientSession() as session:
        task = members_list_request(session, data)
        return await asyncio.gather(task)