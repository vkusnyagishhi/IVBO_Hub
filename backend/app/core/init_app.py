import logging

from asyncio import sleep

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from app.settings.log import DEFAULT_LOGGING
from app.settings.config import settings

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


def register_db(app: FastAPI, db_url: str = None):
    db_url = db_url or settings.DB_URL
    app_list = get_app_list()
    app_list.append("aerich.models")
    register_tortoise(
        app, 
        db_url=db_url,
        modules={"models": app_list},
        add_exception_handlers=True,
    )


async def upgrade_db(app: FastAPI, db_url: str = None):
    command = Command(tortoise_config=TORTOISE_ORM, app="models")
    await command.init()
    await command.upgrade()