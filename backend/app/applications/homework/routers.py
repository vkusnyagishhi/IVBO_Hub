from datetime import datetime, timedelta, date
from typing import List

from pydantic import UUID4

from app.applications.homework.models import Homework
from app.applications.users.models import User
from app.core.auth.utils.contrib import get_current_admin, get_current_user
from app.applications.files.models import File
from app.applications.disciplines.models import Discipline
from app.applications.homework.schemas import BaseHomeworkCreate, BaseHomeworkDB, BaseHomeworkOut, BaseHomeworkUpdate

from app.settings.config import settings

from fastapi import APIRouter, Depends, HTTPException
from fastapi import File
from fastapi.encoders import jsonable_encoder
from fastapi.responses import FileResponse

import string

router = APIRouter()


@router.get("/", response_model=List[BaseHomeworkOut], status_code=200)
async def read_homeworks_by_date(
    date: date,
    skip: int = 0,
    limit: int = 100
):
    homeworks = await Homework.filter(date_deadline=date).limit(limit=limit).offset(skip)
    return homeworks


@router.post("/", response_model=BaseHomeworkOut, status_code=201)
async def create_homework(
    *,
    homework_in: BaseHomeworkCreate,
    current_user: User = Depends(get_current_user)
):
    db_homework = BaseHomeworkCreate(**homework_in.model_dump())
    created_homework = await Homework.create(db_homework, user=current_user)
    return created_homework

@router.patch("/", response_model=BaseHomeworkOut, status_code=200)
async def update_homework(
    uuid: UUID4,
    homework_in: BaseHomeworkUpdate,
    current_user: User = Depends(get_current_user)
):
    homework = await Homework.get_or_none(uuid=uuid)
    
    if not homework:
        raise HTTPException(status_code=404, detail="The homework with this uuid does not exist")
    
    homework.update_from_dict(homework_in)
    homework.datetime_edited = datetime.utcnow() + datetime(hours=3)
    homework.user = current_user

    await homework.save()
    return homework


@router.delete("/", status_code=204)
async def delete_homework(
    uuid: UUID4,
    current_user: User = Depends(get_current_user)
):
    homework = await Homework.get_or_none(uuid=uuid)

    if not homework:
        raise HTTPException(status_code=404, detail="The homework with this uuid does not exist")
    
    await homework.delete()





