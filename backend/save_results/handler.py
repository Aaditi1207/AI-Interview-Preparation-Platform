import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "common"))

from dynamo_client import ensure_user_exists, save_interview_result
from response_utils import build_response, error_response, get_user_id, parse_body
from logger import get_logger

logger = get_logger(__name__)


def lambda_handler(event, context):
    try:
        user_id = get_user_id(event)
        body = parse_body(event)

        domain = body.get("domain")
        difficulty = body.get("difficulty")
        questions = body.get("questions")
        answers = body.get("answers")
        score = body.get("score")
        feedback = body.get("feedback")
        email = body.get("email")

        if not all([domain, difficulty, questions, answers is not None, score is not None]):
            return error_response(400, "domain, difficulty, questions, answers, and score are required")

        ensure_user_exists(user_id, email=email)

        item = save_interview_result(
            user_id=user_id,
            domain=domain,
            difficulty=difficulty,
            questions=questions,
            answers=answers,
            score=score,
            feedback=feedback or {},
        )

        logger.info(f"Interview {item['interview_id']} saved for user {user_id}")

        return build_response(201, {
            "message": "Interview results saved successfully",
            "interview_id": item["interview_id"],
            "created_at": item["created_at"],
        })

    except ValueError as e:
        logger.warning(f"Validation/auth error: {e}")
        return error_response(401, str(e))
    except Exception as e:
        logger.error(f"Unhandled error in save_results: {e}", exc_info=True)
        return error_response(500, "Internal server error while saving results")
