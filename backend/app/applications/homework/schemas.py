import uuid
from typing import Optional
from datetime import datetime, date

from pydantic import BaseModel, UUID4, validator


class BaseProperties(BaseModel):
    @validator("uuid", pre=True, always=True, check_fields=False)
    def default_hashed_id(cls, v):
        return v or uuid.uuid4()
    

class BaseHomework(BaseProperties):
    uuid: Optional[UUID4] = None


class BaseHomeworkCreate(BaseProperties):
    text: str
    user: UUID4
    discipline: UUID4
    picture: Optional[UUID4] = None
    date_deadline: date


    class Config:
        schemas_extra = {
            "example": {
                "text": "string",
                "discipline": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d", 
                "user": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                "file": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                "date_deadline": "date",
            }
        }


class BaseHomeworkUpdate(BaseProperties):
    text: Optional[str] = None
    file: Optional[UUID4] = None


class BaseHomeworkDB(BaseHomework):
    text: str
    user: UUID4
    file: Optional[UUID4] = None
    datetime_edited: datetime

    class Config:
        from_attributes = True


class BaseHomeworkOut(BaseHomework):
    text: str
    user: UUID4
    file: Optional[UUID4] = None
    datetime_edited: datetime

    class Config:
        schemas_extra = {
            "example": {
                "uuid": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                "text": "string",
                "user": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                "file": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                "datetime_edited": "2023-10-16T08:40:47.885Z"
            }
        }
