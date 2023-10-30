from typing import Optional

from tortoise import fields
from tortoise.exceptions import DoesNotExist

from app.applications.files.schemas import BaseFileCreate
from app.applications.users.models import User

from app.core.base.base_models import BaseModel


class File(BaseModel):
    title = fields.CharField(max_length=256)
    type = fields.CharField(max_length=32)
    modifying_datetime = fields.DatetimeField(auto_now_add=True)
    path = fields.CharField(max_length=256, null=True)
    is_private = fields.BooleanField(default=True)
    user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField(
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
    async def get_by_uuid(cls, uuid: str) -> Optional["File"]:
        try:
            query = cls.get_or_none(uuid=uuid)
            file = await query
            return file
        except DoesNotExist:
            return None
        
    @classmethod
    async def create(cls, file: BaseFileCreate, user: User) -> "File":
        file_dict = file.model_dump()
        model = cls(**file_dict, user=user)
        await model.save()
        return model
    
    class Meta:
        table = "files"