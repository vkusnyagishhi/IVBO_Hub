from typing import Optional
import uuid

from pydantic import BaseModel, UUID4, validator


class BaseProperties(BaseModel):
    @validator("uuid", pre=True, always=True, check_fields=False)
    def default_hashed_id(cls, v):
        return v or uuid.uuid4()
    

class CredentialSchema(BaseModel):
    username: str
    token: str

    class Config:
        schemas_extra = {
            "example": {"username": "cherry4xo", "token": "SbjpvnBzMIpPEexbjwFPNEQkxEigXxaF"}
        }


class TelegramLoginData(BaseProperties):
    id: int
    first_name: str
    last_name: str | None = None
    username: str | None = None
    photo_url: str | None = None
    auth_date: int
    hash: str

    class Config:
        schemas_extra = {
            "example": {
                "id": 0,
                "first_name": "никита",
                "last_name": "нулифаер",
                "username": "cherry4xo",
                "photo_url": "url",
                "auth_date": 0,
                "hash": "string"
            }
        }


class JWTToken(BaseModel):
    access_token: str
    token_type: str


class JWTTokenData(BaseModel):
    main: str = None


class JWTTokenPayload(BaseModel):
    user_uuid: UUID4 = None


class TgToken(BaseModel):
    username: str
    short_token: str


class Msg:
    msg: str