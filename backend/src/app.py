import logging

from beanie import init_beanie
from fastapi import Depends, FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import PlainTextResponse

from backend.src.db import User, db
from backend.src.schemas import UserCreate, UserRead, UserUpdate, DeedRecordRequestBody, GetDeedRecordRequestBody
from backend.src.users import auth_backend, current_active_user, fastapi_users

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: Exception):
    logging.exception(exc)
    return PlainTextResponse(str(exc), status_code=400)


@app.post("/save-deed-records")
async def create_deed_record(
    request_params: DeedRecordRequestBody,
    request: Request,
    user: User = Depends(current_active_user),
):
    deeds_kws = list(request_params.deeds.keys())
    doc = {
        "user_id": user.id,
        "deeds_list": deeds_kws,
    }
    query = {"user_id": user.id,}
    update = {"$set": doc}
    await db.deed_list.update_one(query, update, upsert=True)

    for date_num in range(len(request_params.dates)):
        document = {
            "user_id": user.id,
            "deeds": {},
        }
        for deed_name, vals_list in request_params.deeds.items():
            document["deeds"][deed_name] = vals_list[date_num]

        query = {"user_id": user.id, "date": request_params.dates[date_num]}
        update = {"$set": document}
        result = await db.deeds.update_one(query, update, upsert=True)

    return "OK"


@app.post("/get-deed-records")
async def get_deed_records(
    request_params: GetDeedRecordRequestBody,
    request: Request,
    user: User = Depends(current_active_user),
):
    response = {}
    deeds_list = await db.deed_list.find_one({'user_id': user.id}, {'_id': 0, 'user_id': 0})
    response['deeds_list'] = deeds_list['deeds_list']
    for date in request_params.dates:
        doc = await db.deeds.find_one({'date': date, 'user_id': user.id}, {'_id': 0, 'user_id': 0})

        response[date] = doc
    return response


@app.on_event("startup")
async def on_startup():
    await init_beanie(
        database=db,
        document_models=[
            User,
        ],
    )


@app.post("/")
async def root(request: Request):
    await request.json()
    return await request.json()
