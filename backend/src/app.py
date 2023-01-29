from beanie import init_beanie
from fastapi import Depends, FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request

from backend.src.db import User, db
from backend.src.schemas import UserCreate, UserRead, UserUpdate
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
async def create_deed_record(request: Request, user: User = Depends(current_active_user)):
    document = {'test': 'value'}

    result = await db.test_collection.insert_one(document)

    print('result %s' % repr(result.inserted_id))
    return "OK"


@app.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}


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