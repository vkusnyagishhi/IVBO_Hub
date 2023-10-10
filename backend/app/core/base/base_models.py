from tortoise import models, fields


class BaseModel(models.Model):
    uuid = fields.UUIDField(unique=True, pk=True)

    async def to_dict(self):
        d = {}
        for field in self._meta.db_fields:
            d[field] = getattr(self, field)
        for field in self._meta.backward_fk_fields:
            d[field] = await getattr(self, field).all().values()
        return d
    
    class Meta:
        abstract = True