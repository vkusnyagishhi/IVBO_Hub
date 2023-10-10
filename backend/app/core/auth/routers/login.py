from datetime import timedelta

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.core.auth.schemas import JWTToken, CredentialSchema
from app.core.auth.utils.contrib import authenticate
from app.core.auth.utils.jwt import create_access_token
from app.settings.config import settings

router = APIRouter()


@router.post("/access-token", response_model=JWTToken)
async def login_access_token(credentials: OAuth2PasswordRequestForm = Depends()):
    credentials = CredentialSchema(email=credentials.username, password=credentials.password)
    user = await authenticate(credentials)

    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)

    return {
        "access_token": create_access_token(data={"user_uuid": str(user.uuid), "expires_delta": access_token_expires}),
        "token_type": "bearer",
    }
