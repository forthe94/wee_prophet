import logging
import os

import uvicorn

DATABASE_URL = os.getenv("DATABASE_URL", "mongodb://root:example@localhost:27017")
ENVIRONMENT: str = os.environ.get("ENVIRONMENT", "dev")

if ENVIRONMENT in ("dev", "stage"):
    DEFAULT_LOG_LEVEL = "DEBUG"
else:
    DEFAULT_LOG_LEVEL = "INFO"

BENCHMARK_MODE: bool = os.environ.get("BENCHMARK_MODE", "false").lower() == "true"

LOG_LEVEL: int = {
    "ERROR": logging.ERROR,
    "INFO": logging.INFO,
    "DEBUG": logging.DEBUG,
}[os.environ.get("LOG_LEVEL", DEFAULT_LOG_LEVEL)]

LOG_LEVEL_UVICORN: str = {
    "ERROR": 'error',
    "INFO": 'info',
    "DEBUG": 'debug',
}[os.environ.get("LOG_LEVEL", DEFAULT_LOG_LEVEL)]