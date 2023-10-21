import uuid
from typing import Optional

from pydantic import BaseModel, EmailStr, UUID4, validator


class BaseProperties(BaseModel):
    @validator("uuid", pre=True, always=True, check_fields=False)
    def default_hashed_id(cls, v):
        return v or uuid.uuid4()
    

class BaseUser(BaseProperties):
    uuid: Optional[UUID4] = None
    username: Optional[str] = None
    first_name: Optional[str]
    last_name: Optional[str] = None
    is_admin: Optional[bool] = False
    id: Optional[str] = None


class BaseUserCreate(BaseProperties):
    username: str
    id: int
    hash: str
    first_name: str
    last_name: Optional[str] = None


    class Config:
        schemas_extra = {"example": {"username": "cherry4xo", "id": 0, "hash": "string", "first_name": "string", "last_name": "string"}}


class BaseUserUpdate(BaseProperties):
    first_name: Optional[str]
    last_name: Optional[str]
    hash: Optional[str]
    username: Optional[str]


class BaseUserDB(BaseUser):
    uuid: UUID4

    class Config:
        from_attributes = True


class BaseUserOut(BaseUser):
    uuid: UUID4
    id: int
    username: str
    is_admin: bool

    class Config:
        from_attributes = True

        schemas_extra = {
            "example": {
                "uuid": "b3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8",
                "username": "cherry4xo",
                "admin": False,
                "id": "372203395",
            }
        }


class TgToken(BaseProperties):
    token: str


class TgTokenWithId(BaseProperties):
    token: str
    id: int

    class Config:
        schemas_extra = {"example": {"token": "SbjpvnBzMIpPEexbjwFPNEQkxEigXxaF", "id": "372203395"}}