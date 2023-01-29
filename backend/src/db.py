import motor.motor_asyncio
from beanie import PydanticObjectId, Document
from fastapi_users.db import BeanieBaseUser, BeanieUserDatabase

DATABASE_URL = "mongodb://root:example@localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(
    DATABASE_URL, uuidRepresentation="standard"
)
db = client["wee_prophet"]


class User(BeanieBaseUser[PydanticObjectId]):
    pass


async def get_user_db():
    yield BeanieUserDatabase(User)