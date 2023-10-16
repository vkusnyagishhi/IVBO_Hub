from typing import Optional

from tortoise import fields
from tortoise.exceptions import DoesNotExist

from app.applications.disciplines.schemas import BaseDisciplineCreate
from app.applications.files import File
from app.applications.users import User
from app.applications.homework.models import Homework

from app.core.base.base_models import BaseModel


class Discipline(BaseModel):
    title: fields.CharField(max_length=64)
    datetime_edited: fields.DatetimeField(auto_now_add=True)
    homework: fields.ManyToManyRelation["Homework"] = fields.ManyToManyField(
        "models.Homework", related_name="homework_list", to_field="uuid", through="Homework_list", on_delete=fields.CASCADE
    )

    @classmethod
    async def create(cls, discipline: BaseDisciplineCreate) -> "Discipline":
        discipline_dict = discipline.model_dump()
        model = cls(**discipline_dict)
        await model.save()
        return model