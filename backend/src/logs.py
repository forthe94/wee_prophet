from __future__ import annotations

import json
import logging
import sys
import traceback
from types import FrameType
from typing import Union, cast

import loguru
from loguru import logger

from . import config


def plain_formatter(record: loguru.Record) -> str:
    format_ = (
        "<green>{level}\t{time:YYYY-MM-DD HH:mm:ss,SSS}</green> "
        "<yellow>{name}</yellow> "
        "<white>{file}:{line}</white> "
        "<blue>{message}</blue>\n"
    )
    if record["exception"] is not None:
        format_ += "{exception}\n"
    return format_


def json_formatter(record: loguru.Record) -> str:
    data = {
        "time": f"{record['time'].astimezone().isoformat()}Z",
        "logger": record["name"],
        "filename": f"{record['file']}:{record['line']}",
        "level": record["level"].name,
        "text": record["message"],
        **record["extra"],
    }
    if record["exception"] is not None:
        data["stack"] = traceback.format_exc()

    record["_serialized"] = json.dumps(data)  # type: ignore [typeddict-item]
    return "{_serialized}\n"


if config.ENVIRONMENT == "dev":
    _colorize = True
    _formatter = plain_formatter
else:
    _colorize = False
    _formatter = json_formatter


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "loggers": {
        "uvicorn.error": {"level": logging.INFO},
        "uvicorn.access": {"level": logging.INFO},
    },
}


LOGURU = {
    "handlers": [
        {
            "sink": sys.stdout,
            "format": _formatter,
            "level": config.LOG_LEVEL,
            "colorize": _colorize,
            "backtrace": False,
            "diagnose": config.ENVIRONMENT in ("dev", "stage"),
        },
    ],
    "activation": [("jrpc", True)],
}


class InterceptHandler(logging.Handler):
    """
    Default handler from examples in loguru documentaion.
    See https://loguru.readthedocs.io/en/stable/overview.html#entirely-compatible-with-standard-logging
    """

    logging_libs = (logging.__file__,)

    def emit(self, record: logging.LogRecord) -> None:
        # Get corresponding Loguru level if it exists
        try:
            level: Union[str, int] = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find caller from where originated the logged message
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename in self.logging_libs:
            frame = cast(FrameType, frame.f_back)
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )


def setup_logging() -> None:
    """Устанавливает loguru-совместимое логирование (и sentry).

    * хэндлеры рутового логгера заменяются на InterceptHandler
    * хэндлеры всех остальных логгеров удаляются
    * все логи льются в рутовый логгер

    Если установлен config.SENTRY_DSN, то настраивает sentry.
    """
    logging.root.handlers = [InterceptHandler()]
    logging.root.setLevel(config.LOG_LEVEL)

    for name in logging.root.manager.loggerDict.keys():
        logging.getLogger(name).handlers = []
        logging.getLogger(name).propagate = True

    logger.configure(**LOGURU)  # type: ignore
