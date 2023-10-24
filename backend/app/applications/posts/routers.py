from datetime import datetime, timedelta
from typing import List, Optional

from pydantic import UUID4

from app.core.auth.utils.contrib import get_current_admin, get_current_user

from app.applications.users.models import User
from app.applications.posts.models import Post
from app.applications.posts.schemas import BasePostCreate, BasePostDB, BasePostOut, BasePostUpdate

from app.settings.config import settings

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder

router = APIRouter()


@router.get("/", response_model=List[BasePostOut], status_code=200)
async def read_posts(
    skip: int = 0,
    limit: int = 0,
):
    posts = await Post.all().limit(limit=limit).offset(skip)
    return posts


@router.get("/my_posts", response_model=List[BasePostOut], status_code=200)
async def read_posts_me(
    current_user: User = Depends(get_current_user)
):
    posts = await Post.filter(user=current_user)

    return posts


@router.post("/", response_model=BasePostOut, status_code=201)
async def create_post(
    *,
    post_in: BasePostCreate
):
    db_post = BasePostCreate(**post_in.model_dump())
    created_post = await Post.create(db_post)
    return create_post


@router.patch("/my_posts/{uuid}", response_model=BasePostOut, status_code=201)
async def update_post_me(
    uuid: UUID4,
    post_in: BasePostUpdate, 
    current_user: User = Depends(get_current_user)
):
    post = await Post.get_or_none(uuid=uuid)

    if post is None:
        raise HTTPException(
            status_code=404, 
            detail="The post with this uuid does not exist"
        )
    
    if post.user != current_user:
        raise HTTPException(
            status_code=403, 
            detail="Not enough privileges: current user is not an admin or a creator of this post"
        )
    
    post = await Post.update_from_dict(post_in)

    await post.save()
    return post


@router.delete("/my_posts/{uuid}", status_code=204)
async def delete_post_me(
    uuid: UUID4,
    current_user: User = Depends(get_current_user)
):
    post = await Post.get_or_none(uuid=uuid)

    if post is None:
        raise HTTPException(
            status_code=404, 
            detail="The post with this uuid does not exist"
        )
    
    if post.user != current_user:
        raise HTTPException(
            status_code=403, 
            detail="Not enough privileges: current user is not an admin or a creator of this post"
        )

    await post.delete()


@router.patch("/{uuid}", response_model=BasePostOut, status_code=201)
async def update_post(
    uuid: UUID4,
    post_in: BasePostUpdate,
    current_user: User = Depends(get_current_admin)
):
    post = await Post.get_or_none(uuid=uuid)
    
    if post is None:
        raise HTTPException(
            status_code=404,
            detail="The post with this uuid does not exist"
        )
    
    post = await Post.update_from_dict(post_in)

    await post.save()
    return post


@router.delete("/{uuid}", status_code=204)
async def delete_post(
    uuid: UUID4,
    current_user: User = Depends(get_current_admin)
):
    post = await Post.get_or_none(uuid=uuid)

    if post is None:
        raise HTTPException(
            status_code=404,
            detail="The post with this uuid does not exist"
        )
    
    await post.delete()