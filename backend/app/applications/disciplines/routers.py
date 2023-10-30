from typing import List

from app.core.auth.utils.contrib import get_current_admin, get_current_user
from app.applications.disciplines.models import Discipline
from app.applications.disciplines.schemas import (
    BaseDisciplineCreate, 
    BaseDisciplineDB, 
    BaseDisciplineOut, 
    BaseDisciplineUpdate,
    BaseDisciplineOutForList)

from app.settings.config import settings

from fastapi import APIRouter

router = APIRouter()


@router.get("/", response_model=List[BaseDisciplineOutForList], status_code=200)
async def read_disciplines(
    skip: int = 0,
    limit: int = 100
):
    disciplines = await Discipline.all().limit(limit=limit).offset(skip)
    return disciplines


@router.post("/", response_model=BaseDisciplineOutForList, status_code=201)
async def create_discipline(
    *,
    discipline_in: BaseDisciplineCreate,
):
    created_discipline = await Discipline.create(discipline_in)
    return created_discipline

