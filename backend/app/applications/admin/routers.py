from datetime import datetime, timedelta
from typing import List, Optional

from pydantic import UUID4

from app.core.auth.utils.contrib import get_current_user, get_current_admin
from app.applications.users.models import User, ShortTgToken
from app.applications.users.schemas import BaseUserOut
from app.applications.admin.schemas import BaseUserGrants

from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.patch("/grant_user/{uuid}", response_model=BaseUserOut, status_code=201)
async def grant_user(
    uuid: UUID4,
    grants: BaseUserGrants,
    current_user: User = Depends(get_current_admin)
):
    user = await User.get_or_none(uuid=uuid)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="The user with this uuid does not exist"
        )
    
    user.is_admin = grants.is_admin
    await user.save()

    return user


@router.delete("/{uuid}", status_code=204)
async def delete_user_by_uuid(
    uuid: UUID4,
    current_user: User = Depends(get_current_admin)
):
    user = await User.get_or_none(uuid=uuid)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="The user with this uuid does not exist"
        )
    
    if user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="The user with this uuid is admin. You do not have enough permission to delete this user"
        )
    
    await user.delete()


@router.get("/users-is-admin", response_model=List[BaseUserOut], status_code=200)
async def read_users_is_admin(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin)
):
    users = await User.filter(is_admin=True).offset(skip).limit(limit)

    return users


@router.get("/users-is-not-admin", response_model=List[BaseUserOut], status_code=200)
async def read_users_is_admin(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin)
):
    users = await User.filter(is_admin=False).offset(skip).limit(limit)

    return users