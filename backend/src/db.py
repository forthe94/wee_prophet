import motor.motor_asyncio
from beanie import PydanticObjectId
from fastapi_users.db import BeanieBaseUser, BeanieUserDatabase

from backend.src import config

client = motor.motor_asyncio.AsyncIOMotorClient(
    config.DATABASE_URL, uuidRepresentation="standard"
)
db = client["wee_prophet"]


class User(BeanieBaseUser[PydanticObjectId]):
    pass


async def get_user_db():
    yield BeanieUserDatabase(User)
