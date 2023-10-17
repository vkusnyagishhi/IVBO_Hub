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
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    homeworks = await Homework.filter(date_deadline=date).limit(limit=limit).offset(skip)
    return homeworks


@router.post("/", response_model=BaseHomeworkOut, status_code=201)
async def create_homework(
    *,
    homework_in: BaseHomeworkCreate,
    current_user: User = Depends(get_current_user)
):
    pass