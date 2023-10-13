from datetime import datetime, timedelta

import jwt
from fastapi.encoders import jsonable_encoder

from app.settings.config import settings

ALGORITHM = "HS256"
access_token_jwt_subject = "access"


def create_access_token(*, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + timedelta(hours=3) + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=3) + timedelta(minutes=15)
    to_encode.update({"exp": expire.timestamp(), "sub": access_token_jwt_subject})
    encoded_jwt = jwt.encode(jsonable_encoder(to_encode), settings.SECRET_KEY, algorithm=ALGORITHM)
    print(jsonable_encoder(to_encode))
    
    return encoded_jwt