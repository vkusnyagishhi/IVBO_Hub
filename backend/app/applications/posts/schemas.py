import uuid
from typing import Optional
from datetime import datetime

from pydantic import BaseModel, UUID4, validator


class BaseProperties(BaseModel):
    @validator("uuid", pre=True, always=True, check_fields=False)
    def default_hashed_id(cls, v):
        return v or uuid.uuid4()
    

class BasePost(BaseProperties):
    uuid: Optional[UUID4] = None
    title: Optional[str] = None
    text: Optional[str] = None


class BasePostCreate(BaseProperties):
    title: str
    text: str
    file_id: Optional[UUID4] = None

    class Config:
        schemas_extra = {
            "example": {
                "title": "Post title",
                "text": "Post text",
                "file_id": "b3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8"
            }
        }


class BasePostUpdate(BaseProperties):
    title: Optional[str] = None
    text: str
    file_id: Optional[UUID4] = None

    class Config:
        schemas_extra = {
            "example": {
                "text": "Post text",
                "user": "b3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8",
                "file": "b3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8"
            }
        }


class BasePostDB(BasePost):
    uuid: UUID4
    title: str
    text: str
    user_id: UUID4
    file_id: Optional[UUID4] = None
    datetime_created: datetime

    class Config:
        from_attributes = True


class BasePostOut(BasePost):
    uuid: UUID4
    title: str
    text: str
    user_id: UUID4
    file_id: Optional[UUID4] = None
    datetime_created: datetime

    class Config:
        from_attributes = True

        schemas_extra = {
            "example": {
                "uuid": "b3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8",
                "text": "Post text",
                "user": "b3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8",
                "file": "b3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8"
            }
        }

