import os
import uuid
from datetime import datetime, timezone
import boto3

from logger import get_logger

logger = get_logger(__name__)

_dynamodb = boto3.resource("dynamodb")

USERS_TABLE = os.environ.get("USERS_TABLE")
INTERVIEW_HISTORY_TABLE = os.environ.get("INTERVIEW_HISTORY_TABLE")


def get_users_table():
    return _dynamodb.Table(USERS_TABLE)


def get_interview_history_table():
    return _dynamodb.Table(INTERVIEW_HISTORY_TABLE)


def ensure_user_exists(user_id: str, email: str = None):
    """Creates a user record if one doesn't already exist (idempotent)."""
    table = get_users_table()
    existing = table.get_item(Key={"user_id": user_id}).get("Item")
    if existing:
        return existing

    item = {
        "user_id": user_id,
        "email": email or "unknown",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    table.put_item(Item=item)
    logger.info(f"Created new user record for {user_id}")
    return item


def save_interview_result(user_id: str, domain: str, difficulty: str,
                           questions: list, answers: list, score: float,
                           feedback: dict) -> dict:
    table = get_interview_history_table()

    item = {
        "user_id": user_id,
        "interview_id": str(uuid.uuid4()),
        "domain": domain,
        "difficulty": difficulty,
        "questions": questions,
        "answers": answers,
        "score": score,
        "feedback": feedback,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    table.put_item(Item=item)
    logger.info(f"Saved interview {item['interview_id']} for user {user_id}")
    return item


def get_user_history(user_id: str, limit: int = 50) -> list:
    table = get_interview_history_table()

    response = table.query(
        KeyConditionExpression=boto3.dynamodb.conditions.Key("user_id").eq(user_id),
        ScanIndexForward=False,  # most recent first
        Limit=limit,
    )
    return response.get("Items", [])
