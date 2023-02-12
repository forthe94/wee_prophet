import uvicorn

from backend.src import config, logs
from backend.src.app import app
from loguru import logger

from backend.src.logs import setup_logging


def main():
    logger.info("Start app")
    setup_logging()
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level=config.LOG_LEVEL_UVICORN,
        log_config=logs.LOGGING,
        access_log=True,
    )


if __name__ == "__main__":
    main()
