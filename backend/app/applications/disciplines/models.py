from typing import Optional

from tortoise import fields

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
    
    class Meta:
        table = "disciplines"