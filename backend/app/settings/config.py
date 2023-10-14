import os

from decouple import config

import string
import random


class Settings:
    VERSION = "0.1.0"
    APP_TITLE = "mirea_filedrop"
    PROJECT_NAME = "mirea_filedrop"
    APP_DESCRIPTION = "mirea_filedrop"

    SERVER_HOST = "localhost"

    DEBUG = config("DEBUG", cast=bool, default=False)

    APPLICATIONS = [
        "users",
        "files"
    ]

    PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    BASE_DIR = os.path.abspath(os.path.join(PROJECT_ROOT, os.pardir))
    LOGS_ROOT = os.path.join(BASE_DIR, "app/logs")

    DB_USER = config("DB_USER")
    DB_NAME = config("DB_NAME")
    DB_PASS = config("DB_PASS")
    DB_HOST = config("DB_HOST")
    DB_PORT = config("DB_PORT")

    ROOT_ADMIN_EMAIL = config("ROOT_ADMIN_EMAIL")
    ROOT_ADMIN_PASSWORD = config("ROOT_ADMIN_PASSWORD")

    DB_URL = f"postgres://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    DB_CONNECTIONS = {
        "default": DB_URL,
    }

    SECRET_KEY = config("SECRET_KEY", default="".join([random.choice(string.ascii_letters) for _ in range(32)]))
    JWT_ALGORITHM = "HS25"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 day

    LOGIN_URL = SERVER_HOST + "/api/auth/login/access-token"

    #REDIS_PASSWORD = config("REDIS_PASSWORD", default="")
    #REDIS_HOST = config("REDIS_HOST")
    #REDIS_PORT = config("REDIS_PORT", cast=int, default=6379)

    #REDIS_URL = f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/1"

    APPLICATIONS_MODULE = "app.applications"

    CORS_ORIGINS = ["*"]
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_METHODS = ["*"]
    CORS_ALLOW_HEADERS = ["*"]

    DATA_PATH = "data/files/"


settings = Settings()