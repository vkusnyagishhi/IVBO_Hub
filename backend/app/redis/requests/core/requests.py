from typing import Optional

from app.redis.database import r
from app.redis.requests.core.schemas import ShortToken
from app.core.auth.utils.password import get_password_hash

async def load_short_token(schema: ShortToken) -> bool:
    async with r.pipeline(transaction=True) as pipe:
        token = await (pipe.hget(f"{schema.username}:token", "hash"))

        if token is not None:
            await (pipe.delete(f"{schema.username}:token"))

        token = await (pipe.hset(
            f"{schema.username}:token", 
            mapping={
                "hash": get_password_hash(schema.short_token)
            })    
        )

        if token is not None:
            return True
        return False
