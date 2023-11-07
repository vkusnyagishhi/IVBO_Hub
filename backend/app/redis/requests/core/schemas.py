import uuid

from pydantic import BaseModel, UUID4, validator


class ShortToken(BaseModel):
    username: str
    short_token: str