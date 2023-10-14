from typing import Optional, List

from tortoise import fields
from tortoise.exceptions import DoesNotExist

from app.applications.files.schemas import BaseFileCreate
from app.applications.users.models import User

from app.core.base.base_models import BaseModel


class File(BaseModel):
    title = fields.CharField(max_length=256)
    type = fields.CharField(max_length=32)
    modifying_datetime = fields.DatetimeField(auto_now_add=True)
    user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyRelation(
        "models.User", related_name="file", to_field="uuid", on_delete=fields.CASCADE
    )

    @classmethod
    async def get_by_title(cls, title: str) -> Optional["File"]:
        try:
            query = cls.get_or_none(title=title)
            file = await query
            return file
        except DoesNotExist:
            return None
        
    @classmethod
    async def create(cls, file: BaseFileCreate) -> "File":
        file_dict = file.model_dump()
        model = cls(**file_dict)
        await model.save()
        return model
    
    class Meta:
        table = "files"