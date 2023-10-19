import uuid
from typing import Optional
from datetime import datetime, timedelta

from pydantic import BaseModel, UUID4, validator


class BaseProperties(BaseModel):
    @validator("uuid", pre=True, always=True, check_fields=False)
    def default_hashed_id(cls, v):
        return v or uuid.uuid4()
    

class BaseFile(BaseProperties):
    uuid: Optional[UUID4] = None
    type: str = None
    user_id: str = None


class BaseFileCreate(BaseProperties):
    title: str
    type: str
    is_private: bool = True

    class Config:
        schemas_extra = {"example": {"title": "string", "type": "string", "is_private": True}}


class BaseFileUpdate(BaseProperties):
    title: Optional[str] = None
    type: Optional[str] = None


class BaseFileDB(BaseFile):
    uuid: UUID4
    title: str
    type: str
    modifying_datetime: datetime
    is_private: bool

    class Config:
        from_attributes = True


class BaseFileOut(BaseFile):
    uuid: UUID4
    title: str
    type: str
    modifying_datetime: datetime
    user_id: UUID4
    is_private: bool

    class Config:
        from_attributes = True

        schemas_extra = {
            "example": {
                "uuid": "b3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8",
                "title": "string",
                "type": "string",
                "user_id": "b3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8",
                "modifying_datetime": "2023-10-15T19:09:05.479219Z",
                "is_private": True
            }
        }