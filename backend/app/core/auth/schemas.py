from typing import Optional

from pydantic import BaseModel, UUID4


class CredentialSchema(BaseModel):
    id: int
    first_name: str
    last_name: Optional[str] = None
    username: str
    # photo_url: str
    auth_date: int
    hash: str

    class Config:
        schemas_extra = {
        "example": 
            {
                "id": 809908184,
                "first_name": "cherry4xo",
                "username": "cherry4xo",
                # "photo_url": "url",
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


class Msg:
    msg: str