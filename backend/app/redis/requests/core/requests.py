from typing import Optional

from app.redis.database import r
from app.redis.requests.core.schemas import ShortToken
from app.core.auth.utils.password import get_password_hash

async def load_short_token(schema: ShortToken) -> bool:
    async with r.pipeline(transaction=True) as pipe:
        token = await (pipe.hget(f"{schema.username}:token", "hash").execute())

        if token is not None:
            await (pipe.delete(f"{schema.username}:token").execute())

        token = await (pipe.hset(
            f"{schema.username}:token", 
            mapping={
                "hash": schema.short_token
            }).execute()   
        )

        if token is not None:
            return True
        return False
    

async def get_short_token(username: str) -> Optional[ShortToken]:
    async with r.pipeline(transaction=True) as pipe:
        token = await (pipe.hgetall(f"{username}:token").execute())
        if token is not None:
            return ShortToken(username=username, short_token=token[0]["hash"])
        return None


async def delete_short_token(username: str):
    async with r.pipeline(transaction=True) as pipe:
        await (pipe.delete(f"{username}:token").execute())
