from typing import Optional

from tortoise import fields
from tortoise.exceptions import DoesNotExist

from app.applications.users.schemas import BaseUserCreate

from app.core.auth.utils import password

from app.core.base.base_models import BaseModel


class User(BaseModel):
    email = fields.CharField(max_length=255, unique=True)
    password_hash = fields.CharField(max_length=128, null=True)
    is_admin = fields.BooleanField(default=False)
    tg_id = fields.BigIntField(null=True)
    tg_username = fields.CharField(max_length=64)

    @classmethod
    async def get_by_email(cls, email: str) -> Optional["User"]:
        try:
            query = cls.get_or_none(email=email)
            user = await query
            return user
        except DoesNotExist:
            return None
        
    @classmethod
    async def create(cls, user: BaseUserCreate) -> "User":
        user_dict = user.model_dump()
        password_hash = password.get_password_hash(password=user.password)
        model = cls(**user_dict, password_hash=password_hash)
        await model.save()
        return model
    
    class Meta:
        table = "users"


class ShortTgToken(BaseModel):
    value = fields.CharField(max_length=32, unique=True)
    date = fields.DatetimeField(auto_now_add=True)
    user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField(
        "models.User", related_name="tg_auth", to_field="uuid", on_delete=fields.CASCADE
    )

    class Meta:
        table = "short_tg_token"