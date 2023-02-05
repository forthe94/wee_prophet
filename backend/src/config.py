import os

DATABASE_URL = os.getenv("DATABASE_URL", "mongodb://root:example@localhost:27017")
