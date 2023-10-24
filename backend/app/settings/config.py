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
        "files",
        "homework",
        "disciplines",
        "posts",
        "endpoint",
    ]

    PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    BASE_DIR = os.path.abspath(os.path.join(PROJECT_ROOT, os.pardir))
    LOGS_ROOT = os.path.join(BASE_DIR, "app/logs")

    DB_USER = config("DB_USER")
    DB_NAME = config("DB_NAME")
    DB_PASS = config("DB_PASS")
    DB_HOST = config("DB_HOST")
    DB_PORT = config("DB_PORT")

    ROOT_ADMIN_TG_USERNAME = config("ROOT_ADMIN_TG_USERNAME")
    ROOT_ADMIN_PASSWORD = config("ROOT_ADMIN_PASSWORD")
    ROOT_ADMIN_TG_FIRST_NAME=config("ROOT_ADMIN_TG_FIRST_NAME")
    ROOT_ADMIN_TG_LAST_NAME=config("ROOT_ADMIN_TG_LAST_NAME")
    ROOT_ADMIN_TG_ID=config("ROOT_ADMIN_TG_ID")

    BOT_TOKEN = config("BOT_TOKEN")

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

    MEDIA_TYPES = {
        "application": ["atom", "json", "pdf", "soap", "zip", "gzip", "msword", "yaml"],
        "audio": ["aac", "mpeg", "mp3", "ogg", "wav"],
        "image": ["gif", "jpeg", "pjpeg", "png", "svg", "tiff", "webp"],
        "text": ["cmd", "css", "csv", "html", "js", "plain", "php", "xml", "cpp", "h", "py", "java"],
        "video": ["mpeg", "mp4", "ogg", "webm"]
    }

    MONTHS_COUNT = {
        "1": 31,
        "2": 28,
        "3": 31,
        "4": 30,
        "5": 31,
        "6": 30,
        "7": 31,
        "8": 31,
        "9": 30,
        "10": 31,
        "11": 30,
        "12": 31,
    }


settings = Settings()