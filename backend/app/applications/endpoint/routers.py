from datetime import datetime, timedelta, date
from json import dumps
from typing import List, Optional

from pydantic import UUID4

from app.core.auth.utils.contrib import get_current_admin, get_current_user

from app.applications.users.models import User
from app.applications.files.models import File
from app.applications.disciplines.models import Discipline
from app.applications.homework.models import Homework

from app.applications.homework.schemas import BaseHomeworkOut
from app.applications.disciplines.schemas import BaseDisciplineOutForList
from app.applications.endpoint.schemas import HomeworkByDay, HomeworkForSemester

from app.settings.config import settings
from app.core.base.utils import UUIDEncoder

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from tortoise.expressions import Q

router = APIRouter()


@router.get("/", response_model=HomeworkByDay, status_code=200)
async def read_homeworks_by_date(
    date: date = date.today() + timedelta(days=1)
):
    homeworks = await Homework.filter(date_deadline=date)
    return {
        "date": date,
        "homework": homeworks
    }


@router.get("/semester", response_model=List[BaseHomeworkOut], status_code=200)
async def read_homeworks_by_semester(
    date: date = date.today()
):
    homework = await Homework.all()
    
    response = [i for i in homework if i.date_deadline > date]

    return response