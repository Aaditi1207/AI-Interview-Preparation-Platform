import logging
import os

def get_logger(name: str) -> logging.Logger:
    """Returns a configured logger for Lambda functions."""
    logger = logging.getLogger(name)
    level = os.environ.get("LOG_LEVEL", "INFO")
    logger.setLevel(level)

    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "[%(levelname)s] %(asctime)s - %(name)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger
