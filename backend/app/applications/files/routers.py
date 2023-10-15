from datetime import datetime, timedelta

from pydantic import UUID4

from app.applications.users.models import User
from app.core.auth.utils.contrib import get_current_admin, get_current_user
from app.applications.files.models import File as FileModel
from app.applications.files.schemas import BaseFileCreate, BaseFileDB, BaseFileOut, BaseFileUpdate

from app.settings.config import settings

from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi import File
from fastapi.encoders import jsonable_encoder
from fastapi.responses import FileResponse

import string

router = APIRouter()


@router.get("/", response_model=List[BaseFileOut], status_code=201)
async def read_files_info(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin)
):
    files = await FileModel.all().limit(limit=limit).offset(skip)
    print(files)
    return files


@router.post("/", response_model=BaseFileOut, status_code=201)
async def create_file(
    *,
    file_in: BaseFileCreate
):
    db_file = BaseFileCreate(**file_in.model_dump())
    created_file = await FileModel.create(db_file)
    return created_file


@router.patch("/my_files/{uuid}", response_model=BaseFileOut, status_code=200)
async def update_my_file_by_uuid(
    uuid: UUID4,
    file_in: BaseFileUpdate,
    current_user: User = Depends(get_current_user)
):
    file = await FileModel.get_or_none(uuid=uuid)

    if not file:
        raise HTTPException(status_code=404, detail="The file with this UUID does not exist")
    
    if file.user != current_user:
        raise HTTPException(status_code=400, detail="Not enough permissions to edit this file")
    
    file = await FileModel.update_from_dict(file_in)
    file.modifying_datetime = datetime.utcnow() + timedelta(hours=3)

    await file.save()
    return file


@router.get("/my_files", response_model=List[BaseFileOut], status_code=200)
async def read_my_files(
    current_user: User = Depends(get_current_user),
):
    files = await FileModel.filter(user=current_user)
    return files


@router.patch("/files/{uuid}", response_model=BaseFileOut, status_code=200)
async def update_file_by_uuid(
    uuid: UUID4,
    file_in: BaseFileUpdate,
    current_user: User = Depends(get_current_admin)
):
    file = await FileModel.get(uuid=uuid)
    if not file:
        raise HTTPException(status_code=404, detail="The file with this uuid does not exist")

    file = await FileModel.update_from_dict(file_in)
    file.modifying_datetime = datetime.utcnow() + timedelta(hours=3)

    await file.save()
    return file