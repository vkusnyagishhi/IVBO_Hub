from os import path, makedirs, remove
import uuid as uuid_
import shutil

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
from fastapi.concurrency import run_in_threadpool

import string

router = APIRouter()


@router.get("/", response_model=List[BaseFileOut], status_code=201)
async def read_files_info(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin)
):
    files = await FileModel.all().limit(limit=limit).offset(skip)
    return files


@router.post("/", response_model=BaseFileOut, status_code=201)
async def create_file(
    *,
    file_in: BaseFileCreate,
    current_user: User = Depends(get_current_user)
):
    db_file = BaseFileCreate(**file_in.model_dump())
    created_file = await FileModel.create(db_file, user=current_user)

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
    
    if file.user_id != current_user.uuid:
        raise HTTPException(status_code=400, detail="Not enough permissions to edit this file")
    
    file.update_from_dict(file_in)
    file.modifying_datetime = datetime.utcnow() + timedelta(hours=3)

    await file.save()
    return file


@router.delete("/my_files/{uuid}", status_code=204)
async def delete_my_file(
    uuid: UUID4,
    current_user: User = Depends(get_current_user)
):
    file = await FileModel.get_or_none(uuid=uuid)
    if not file:
        raise HTTPException(status_code=404, detail="The file with this uuid does not exist")
    
    if file.user_id != current_user.uuid:
        raise HTTPException(status_code=400, detail="Not enough permissions to delete this file")
    
    if path.exists(file.path):
        remove(file.path)
    
    await file.delete()


@router.get("/my_files", response_model=List[BaseFileOut], status_code=200)
async def read_my_files(
    current_user: User = Depends(get_current_user),
):
    files = await FileModel.filter(user=current_user, is_private=True)
    return files


@router.patch("/files/{uuid}", response_model=BaseFileOut, status_code=200)
async def update_file(
    uuid: UUID4,
    file_in: BaseFileUpdate,
    current_user: User = Depends(get_current_admin)
):
    file = await FileModel.get_or_none(uuid=uuid)
    if not file:
        raise HTTPException(status_code=404, detail="The file with this uuid does not exist")

    file = await FileModel.update_from_dict(file_in)
    file.modifying_datetime = datetime.utcnow() + timedelta(hours=3)

    await file.save()
    return file


@router.delete("/files/{uuid}", status_code=204)
async def delete_file(
    uuid: UUID4,
    current_user: User = Depends(get_current_admin)
):
    file = await FileModel.get_or_none(uuid=uuid)
    if not file:
        raise HTTPException(status_code=404, detail="The file with this uuid does not exist")
    
    if path.exists(file.path):
        remove(file.path)

    await file.delete()


@router.post("/my_files/upload/{uuid}", status_code=200)
async def upload_file(
    uuid: UUID4,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    file_fields = await FileModel.get_or_none(uuid=uuid)

    if not file_fields:
        raise HTTPException(status_code=404, detail="The file with this uuid does not exist")

    if file_fields.user_id != current_user.uuid:
        raise HTTPException(status_code=400, detail="Not enough permissions to edit this file")

    media_type = ""

    for keys, values in settings.MEDIA_TYPES.items():
        if file_fields.type in values:
            media_type = keys

    if media_type == "": 
        media_type = "application"

    try:
        file_directory = f"data"
        if not path.exists(file_directory):
            makedirs(file_directory)
        file.filename = f"{str(uuid_.uuid4())}.{file_fields.type}"
        f = await run_in_threadpool(open, f"{file_directory}/{file.filename}", "wb")
        await run_in_threadpool(shutil.copyfileobj, file.file, f)
    except Exception():
        raise HTTPException(status_code=400, detail="Unable to write file")
    finally:
        if 'f' in locals(): await run_in_threadpool(f.close)
        await file.close()

    file_fields.path = f"{file_directory}/{file.filename}"
    await file_fields.save()


@router.get("/my_files/{uuid}", response_class=FileResponse, status_code=200)
async def get_file(
    uuid: UUID4,
    current_user: User = Depends(get_current_user)
):
    file_fields = await FileModel.get_or_none(uuid=uuid)

    if not file_fields:
        raise HTTPException(status_code=404, detail="The file with this uuid does not exist")

    if file_fields.user_id != current_user.uuid:
        raise HTTPException(status_code=400, detail="Not enough permissions to edit this file")
    
    media_type = ""

    for keys, values in settings.MEDIA_TYPES.items():
        if file_fields.type in values:
            media_type = keys

    if media_type == "":
        media_type = "application"

    return FileResponse(
        file_fields.path,
        media_type=media_type,
        filename=f"{file_fields.title}.{file_fields.type}"
    )