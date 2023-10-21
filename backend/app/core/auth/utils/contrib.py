import logging
import hmac
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

import jwt
from fastapi import HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
from fastapi.encoders import jsonable_encoder
# from jwt import PyJWTError
# from jwt.exceptions import InvalidTokenError
from starlette.status import HTTP_403_FORBIDDEN

from app.applications.users.models import User
from app.applications.users.schemas import BaseUserCreate
from app.core.auth.schemas import JWTTokenPayload, CredentialSchema
from app.core.auth.utils import password
from app.core.auth.utils.jwt import ALGORITHM
from app.settings.config import settings

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/auth/login/access-token")


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


async def authenticate(credentials: CredentialSchema) -> Optional[User]:
    if credentials.username:
        user = await User.get_by_tg_username(username=credentials.username)
    else:
        return None
    
    if user is None:
        user = await User.create(credentials)
    
    credentials_dict = (credentials.model_dump())
    print(credentials_dict)
    if credentials_dict["last_name"] is None:
        credentials_dict.pop("last_name")
    hash_cred = credentials_dict.pop("hash")
    credentials_dict = sorted(credentials_dict.items())
    value = "\n".join([f"{key}={value}" for key, value in credentials_dict])
    print(value)
    secret_key = hmac.new("WebAppData".encode(), settings.BOT_TOKEN.encode(), hashlib.sha256).digest()
    calculated_hash = hmac.new(secret_key, value.encode(), hashlib.sha256).hexdigest()

    print(calculated_hash, hash_cred, sep='\n')

    if calculated_hash != hash_cred:
        return None

    # verified, updated_password_hash = password.verify_and_update_password(credentials.password, user.password_hash)

    # if not verified:
    #     return None
    
    # if updated_password_hash is not None:
    #     user.password_hash = updated_password_hash
    #     await user.save()

    return user