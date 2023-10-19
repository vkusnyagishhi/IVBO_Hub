import uuid
from typing import Optional

from pydantic import BaseModel, EmailStr, UUID4, validator


class BaseProperties(BaseModel):
    @validator("uuid", pre=True, always=True, check_fields=False)
    def default_hashed_id(cls, v):
        return v or uuid.uuid4()
    

class BaseUser(BaseProperties):
    uuid: Optional[UUID4] = None
    tg_username: Optional[str] = None
    is_admin: Optional[bool] = False


class BaseUserCreate(BaseProperties):
    tg_username: str
    password: str

    class Config:
        schemas_extra = {"example": {"tg_id": "cherry4xo", "password": "qwerty"}}


class BaseUserUpdate(BaseProperties):
    password: Optional[str]
    tg_username: Optional[str]


class BaseUserDB(BaseUser):
    uuid: UUID4
    password_hash: str

    class Config:
        from_attributes = True


class BaseUserOut(BaseUser):
    uuid: UUID4
    tg_id: Optional[str]

    class Config:
        from_attributes = True

        schemas_extra = {
            "example": {
                "uuid": "b3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8",
                "tg_username": "cherry4xo",
                "is_admin": False,
                "tg_id": "372203395",
            }
        }


class TgToken(BaseProperties):
    token: str


class TgTokenWithId(BaseProperties):
    token: str
    id: int

    class Config:
        schemas_extra = {"example": {"token": "SbjpvnBzMIpPEexbjwFPNEQkxEigXxaF", "tg_id": "372203395"}}