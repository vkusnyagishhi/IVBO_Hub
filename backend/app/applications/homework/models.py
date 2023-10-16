from typing import Optional

from tortoise import fields
from tortoise.exceptions import DoesNotExist

from app.applications.homework.schemas import BaseHomeworkCreate
from app.applications.users.models import User
from app.applications.files.models import File
from app.applications.disciplines.models import Discipline

from app.core.base.base_models import BaseModel


class Homework(BaseModel):
    text: fields.TextField()
    date_deadline: fields.DateField(auto_now_add=True)
    datetime_edited: fields.DatetimeField(auto_now_add=True)
    picture: fields.ForeignKeyNullableRelation["File"] = fields.ForeignKeyField(
        "models.File", related_name="homework_picture", to_field="uuid", on_delete=fields.CASCADE
    )
    user: fields.ForeignKeyNullableRelation["User"] = fields.ForeignKeyField(
        "models.User", related_name="homework_user", to_field="uuid", on_delete=fields.CASCADE
    )
    discipline: fields.ForeignKeyRelation["Discipline"] = fields.ForeignKeyField(
        "models.Discipline", related_name="discipline_homework", to_field="uuid", on_delete=fields.CASCADE
    )

    @classmethod
    async def create(cls, homework: BaseHomeworkCreate) -> "Homework":
        homework_dict = homework.model_dump()
        model = cls(**homework_dict)
        await model.save()
        return model