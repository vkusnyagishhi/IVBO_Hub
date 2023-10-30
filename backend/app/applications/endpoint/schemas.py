import uuid
from typing import Optional, List
from datetime import date, datetime

from pydantic import BaseModel

# from app.applications.disciplines.schemas import BaseDisciplineOutForList
from app.applications.homework.schemas import BaseHomeworkOut


class HomeworkByDay(BaseModel):
    homework: List[BaseHomeworkOut]

    class Config:
        schemas_extra = {
            "example": {
                "homework": [
                    {
                        "uuid": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "text": "string",
                        "user": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "file": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "datetime_edited": "2023-10-16T08:40:47.885Z",
                        "discipline": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d"
                    },
                    {
                        "uuid": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "text": "string",
                        "user": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "file": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "datetime_edited": "2023-10-16T08:40:47.885Z",
                        "discipline": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d"
                    }
                ]
            }
        }


class HomeworkForSemester(BaseModel):
    homeworks: List[HomeworkByDay]

    class Config:
        schemas_extra = {
            "example": 
            [
                {
                    "date": "2023-10-18",
                    "discipline": 
                    {
                        "uuid": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                        "title": "string"
                    },
                    "homework": 
                    [
                        {
                            "uuid": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                            "text": "string",
                            "user": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                            "file": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                            "datetime_edited": "2023-10-16T08:40:47.885Z",
                            "discipline": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d"
                        },
                        {
                            "uuid": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                            "text": "string",
                            "user": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                            "file": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d",
                            "datetime_edited": "2023-10-16T08:40:47.885Z",
                            "discipline": "d3ff7b06-5d72-45a8-8d5d-710ea474e62d"
                        }
                    ]
                }
            ]
        }
