from redis.asyncio import from_url
from app.settings.config import settings

r = from_url(f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}?decode_responses=True")

