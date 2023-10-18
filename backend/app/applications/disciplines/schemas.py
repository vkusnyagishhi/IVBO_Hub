import uuid
from typing import Optional, List

from pydantic import BaseModel, UUID4, validator

from app.applications.homework.schemas import BaseHomeworkOut


class BaseProperties(BaseModel):
    @validator("uuid", pre=True, always=True, check_fields=False)
    def default_hashed_id(cls, v):
        return v or uuid.uuid4()

class BaseDiscipline(BaseProperties):
    uuid: Optional[UUID4] = None


class BaseDisciplineCreate(BaseProperties):
    title: Optional[str] = None


class BaseDisciplineUpdate(BaseProperties):
    title: Optional[str] = None


class BaseDisciplineDB(BaseDiscipline):
    title: str

    class Config:
        from_attributes = True
        schemas_extra = {
            "example": {
                "title": "string"
            }
        }

class BaseDisciplineOut(BaseDiscipline):
    title: str
    homework: List[BaseHomeworkOut]

    class Config:
        from_attributes = True
        schemas_extra = {
            "example": {
                "title": "string",
                "homework": [
                    {
                        "uuid": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "text": "string",
                        "user": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "file": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "datetime_edited": "2023-10-16T08:40:47.885Z"
                    },
                    {
                        "uuid": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "text": "string",
                        "user": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "file": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "datetime_edited": "2023-10-16T08:40:47.885Z"
                    }
                ]
            }
        }


class BaseDisciplineOutForList(BaseDiscipline):
    title: str
    
    class Config:
        from_attributes = True
        schemas_extra = {
            "example": {
                "title": "string"
            }
        }