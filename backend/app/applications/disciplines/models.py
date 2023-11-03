from typing import Optional

from tortoise import fields
from tortoise.exceptions import DoesNotExist

from app.applications.disciplines.schemas import BaseDisciplineCreate

from app.core.base.base_models import BaseModel


class Discipline(BaseModel):
    title = fields.CharField(max_length=64)

    @classmethod
    async def create(cls, discipline: BaseDisciplineCreate) -> "Discipline":
        discipline_dict = discipline.model_dump()
        model = cls(**discipline_dict)
        await model.save()
        return model
    
    @classmethod
    async def get_by_title(cls, title: str) -> "Discipline":
        try:
            query = cls.get_or_none(title=title)
            discipline = await query
            return discipline
        except DoesNotExist:
            return None
    
    class Meta:
        table = "disciplines"