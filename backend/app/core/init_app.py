import logging

from asyncio import sleep

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from app.core.exceptions import APIException
from app.settings.log import DEFAULT_LOGGING
from app.settings.config import settings
from app.applications.users.models import User
from app.applications.users.schemas import BaseUserCreate
from app.core.auth.utils.password import get_password_hash

from app.core.auth.routers.login import router as login_router
from app.applications.admin.routers import router as admin_router
from app.applications.users.routers import router as users_router
from app.applications.files.routers import router as files_router
from app.applications.homework.routers import router as homework_router
from app.applications.disciplines.routers import router as disciplines_router
from app.applications.posts.routers import router as posts_router
from app.applications.endpoint.routers import router as endpoint_router

from aerich import Command

def configure_logging(log_settings: dict = None):
    log_settings = log_settings or DEFAULT_LOGGING
    logging.config.dictConfig(log_settings)


def init_middlewares(app: FastAPI):
    app.add_middleware(
        CORSMiddleware, 
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS
    )

def get_app_list():
    app_list = [f"{settings.APPLICATIONS_MODULE}.{app}.models" for app in settings.APPLICATIONS]
    return app_list

def get_tortoise_config() -> dict:
    app_list = get_app_list()
    app_list.append("aerich.models")
    config = {
        "connections": settings.DB_CONNECTIONS,
        "apps": {
            "models": {
                "models": app_list,
                "default_connection": "default"
            }
        }
    }
    return config

TORTOISE_ORM = get_tortoise_config()


async def create_default_admin_user():
    await sleep(3)
    user = await User.get_by_tg_username(username=settings.ROOT_ADMIN_TG_USERNAME)
    if user:
        return

    admin_user = User()
    admin_user.username = settings.ROOT_ADMIN_TG_USERNAME
    admin_user.first_name = settings.ROOT_ADMIN_TG_FIRST_NAME
    admin_user.last_name = settings.ROOT_ADMIN_TG_LAST_NAME
    admin_user.id = settings.ROOT_ADMIN_TG_ID
    admin_user.is_admin = True
    await admin_user.save()
    return admin_user


def register_db(app: FastAPI, db_url: str = None):
    db_url = db_url or settings.DB_URL
    app_list = get_app_list()
    app_list.append("aerich.models")
    register_tortoise(
        app, 
        db_url=db_url,
        modules={"models": app_list},
        generate_schemas=True,
        add_exception_handlers=True,
    )


async def upgrade_db(app: FastAPI, db_url: str = None):
    command = Command(tortoise_config=TORTOISE_ORM, app="models")
    await command.init()
    await command.upgrade(run_in_transaction=True)


def register_exceptions(app: FastAPI):
    app.exception_handler(APIException)


def register_routers(app: FastAPI):
    app.include_router(login_router, prefix="/auth/login", tags=["login"])
    app.include_router(admin_router, prefix="/admin", tags=["admin"])
    app.include_router(users_router, prefix="/auth/users", tags=["users"])
    app.include_router(files_router, prefix="/files", tags=["files"])
    app.include_router(homework_router, prefix="/homework", tags=["homework"])
    app.include_router(disciplines_router, prefix="/discipline", tags=["disciplines"])
    app.include_router(posts_router, prefix="/posts", tags=["posts"])
    app.include_router(endpoint_router, prefix="/endpoint", tags=["endpoint"])
    