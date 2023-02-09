from beanie import init_beanie
from fastapi import Depends, FastAPI, Header
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request

from backend.src.db import User, db
from backend.src.schemas import UserCreate, UserRead, UserUpdate, DeedRecordRequestBody
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


@app.post("/deed-record")
async def create_deed_record(
    request_params: DeedRecordRequestBody,
    request: Request,
    user: User = Depends(current_active_user),
    auth_header = Header(alias='Authorization'),
):
    for date_num in range(len(request_params.dates)):

        document = {
            'user_id': user.id,
        }
        for deed_name, vals_list in request_params.deeds.items():
            document[deed_name] = vals_list[date_num]

        query = {'user_id': user.id, 'date': request_params.dates[date_num]};
        update = { '$set': document};
        result = await db.deeds.update_one(query, update, upsert=True);

        print("result %s" % repr(result.raw_result))

    return "OK"


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
