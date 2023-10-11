import asyncio

from fastapi import FastAPI
from app.core.exceptions import SettingNotFound
from app.core.init_app import (
    # configure_logging,
    init_middlewares,
    register_db,
    upgrade_db,
    register_exceptions,
    register_tortoise,
    create_default_admin_user
)

try:
    from app.settings.config import settings
except ImportError:
    raise SettingNotFound("Cannot import settings. Create settings file from template.config.py")


app = FastAPI(
    title=settings.APP_TITLE,
    description=settings.APP_DESCRIPTION,
    version=settings.VERSION,
    debug=settings.DEBUG,
    swagger_ui_parameters={"persistAuthorization": True}
)

@app.on_event("startup")
async def db_init():
    await upgrade_db(app)
    register_db(app)


asyncio.create_task(create_default_admin_user())

# configure_logging()
init_middlewares(app)
register_exceptions(app)
register_tortoise(app)