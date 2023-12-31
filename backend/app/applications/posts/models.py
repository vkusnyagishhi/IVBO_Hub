from typing import Optional

from tortoise import fields

from app.applications.users.models import User
from app.applications.files.models import File

from app.applications.posts.schemas import BasePostCreate

from app.core.base.base_models import BaseModel


class Post(BaseModel):
    title = fields.CharField(max_length=128)
    text = fields.TextField()
    file: fields.ForeignKeyRelation["File"] = fields.ForeignKeyField(
        "models.File", related_name="post_file", to_field="uuid", on_delete=fields.CASCADE, null=True
    )
    user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField(
        "models.User", related_name="post_user", to_field="uuid", on_delete=fields.CASCADE
    )
    datetime_created = fields.DatetimeField(auto_now_add=True)

    @classmethod
    async def create(cls, post: BasePostCreate, user: User) -> "Post":
        post_dict = post.model_dump()
        model = cls(**post_dict, user=user)
        await model.save()
        return model
    
    class Meta:
        table = "posts"