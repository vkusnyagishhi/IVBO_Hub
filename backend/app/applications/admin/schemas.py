import uuid
from typing import List, Optional

from pydantic import BaseModel, UUID4, validator

class BaseProperties(BaseModel):
    @validator("uuid", pre=True, always=True, check_fields=False)
    def default_hashed_id(cls, v):
        return v or uuid.uuid4()
    

class BaseUserGrants(BaseModel):
    is_admin: bool