from typing import List

from app.applications.users.models import User
from app.core.auth.utils.contrib import get_current_admin, get_current_user
from app.applications.disciplines.models import Discipline
from app.applications.disciplines.schemas import (
    BaseDisciplineCreate, 
    BaseDisciplineDB, 
    BaseDisciplineOut, 
    BaseDisciplineUpdate,
    BaseDisciplineOutForList)

from app.settings.config import settings

from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from pydantic import UUID4

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
    current_user: User = Depends(get_current_admin)
):
    created_discipline = await Discipline.create(discipline_in)
    return created_discipline


@router.get("/{title}", response_model=BaseDisciplineOutForList, status_code=200)
async def get_discipline_by_title(
    title: str
):
    discipline = await Discipline.get_by_title(title=title)

    if discipline is None:
        raise HTTPException(
            status_code=404,
            detail="The discipline with this title does not exist"
        )
    
    return discipline
    

@router.delete("/", status_code=204)
async def delete_discipline(
    uuid: UUID4,
    current_user: User = Depends(get_current_admin)
):
    discipline = await Discipline.get_or_none(uuid=uuid)
    
    if discipline is None:
        raise HTTPException(
            status_code=404,
            detail="The discipline with this uuid does not exist"
        )
    
    await discipline.delete()


