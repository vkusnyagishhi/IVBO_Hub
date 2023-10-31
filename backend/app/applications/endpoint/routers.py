from datetime import datetime, timedelta, date
import pytz
from typing import List

from app.core.auth.utils.contrib import get_current_user

from app.applications.users.models import User
from app.applications.posts.models import Post
from app.applications.homework.models import Homework

from app.applications.homework.schemas import BaseHomeworkOut
from app.applications.posts.schemas import BasePostOut
from app.applications.endpoint.schemas import HomeworkByDay

from app.settings.config import settings

from fastapi import APIRouter, Depends

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


@router.get("/posts", response_model=List[BasePostOut], status_code=200)
async def get_posts(
    datetime_get: datetime = datetime.utcnow(),
    current_user: User = Depends(get_current_user)
):
    posts = await Post.all()

    response = [i for i in posts if i.datetime_created < datetime_get.replace(tzinfo=pytz.utc)]

    return response