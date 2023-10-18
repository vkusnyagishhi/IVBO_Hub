from datetime import datetime, timedelta, date

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

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from tortoise.expressions import Q

router = APIRouter()


def filter_date_greater_than(date: date, date_now: date = date.today()):
    return date > date_now


@router.get("/", response_model=HomeworkByDay, status_code=200)
async def read_homeworks_by_date(
    date: date = date.today() + timedelta(days=1)
):
    homeworks = await Homework.filter(date_deadline=date)
    return {
        "date": date,
        "homework": homeworks
    }


@router.get("/semester", response_model=HomeworkForSemester, status_code=201)
async def read_homeworks_by_semester():
    response = []
    homeworks = await Homework.all()
    for i in homeworks:
        response.append(await i.to_dict())
    return {"homework": response}