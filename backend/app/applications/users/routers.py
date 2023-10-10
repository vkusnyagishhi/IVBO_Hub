from datetime import datetime, timedelta

from pydantic import UUID4

from app.core.auth.utils.contrib import get_current_admin, get_current_user
from app.core.auth.utils.password import get_password_hash

from app.applications.users.models import User, ShortTgToken
from app.applications.users.schemas import BaseUserOut, BaseUserCreate, BaseUserUpdate, TgToken, TgTokenWithId

