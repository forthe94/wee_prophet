from typing import Any

from beanie import PydanticObjectId
from fastapi_users import schemas
from pydantic import BaseModel


class UserRead(schemas.BaseUser[PydanticObjectId]):
    pass


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass


class DeedRecordRequestBody(BaseModel):
    dates: list[str]
    deeds: dict[str, list[str]]
