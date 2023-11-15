import asyncio

from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler

from app.core.exceptions import SettingNotFound
from app.core.init_app import (
    configure_logging,
    init_middlewares,
    register_db,
    upgrade_db,
    register_exceptions,
    register_routers,
    create_default_admin_user,
)
from app.redis.database import ping_redis_connection, r
from app.schedule.tasks import check_if_birthday_and_return_name


try:
    from app.settings.config import settings
except ImportError:
    raise SettingNotFound("Cannot import settings. Create settings file from template.config.py")


app = FastAPI(
    title=settings.APP_TITLE,
    description=settings.APP_DESCRIPTION,
    version=settings.VERSION,
    debug=settings.DEBUG,
    swagger_ui_parameters={"persistAuthorization": True},
)

@app.on_event("startup")
async def db_init():
    await upgrade_db(app)
    await ping_redis_connection(r)
    register_db(app)

@app.on_event("startup")
async def schedule_birthday():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_if_birthday_and_return_name, 'cron', hour="09", minute="00")
    scheduler.start()

asyncio.create_task(create_default_admin_user())

configure_logging()
init_middlewares(app)
register_exceptions(app)
register_routers(app)