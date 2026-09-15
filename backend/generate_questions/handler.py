import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "common"))

import bedrock_client
from prompt_templates import question_generation_prompt
from response_utils import build_response, error_response, get_user_id, parse_body
from logger import get_logger

logger = get_logger(__name__)

VALID_DOMAINS = {"AWS", "DevOps", "Linux", "Docker", "Kubernetes", "Terraform", "Jenkins", "Azure"}
VALID_DIFFICULTIES = {"Beginner", "Intermediate", "Advanced"}


def lambda_handler(event, context):
    try:
        user_id = get_user_id(event)
        body = parse_body(event)

        domain = body.get("domain")
        difficulty = body.get("difficulty")
        num_questions = int(body.get("num_questions", 5))

        if domain not in VALID_DOMAINS:
            return error_response(400, f"Invalid domain. Must be one of {sorted(VALID_DOMAINS)}")
        if difficulty not in VALID_DIFFICULTIES:
            return error_response(400, f"Invalid difficulty. Must be one of {sorted(VALID_DIFFICULTIES)}")
        if not (1 <= num_questions <= 15):
            return error_response(400, "num_questions must be between 1 and 15")

        logger.info(f"Generating {num_questions} {difficulty} {domain} questions for user {user_id}")

        prompt = question_generation_prompt(domain, difficulty, num_questions)
        raw_output = bedrock_client.invoke_model(prompt, max_tokens=1500, temperature=0.8)
        parsed = bedrock_client.extract_json(raw_output)

        questions = parsed.get("questions", [])
        if not questions:
            return error_response(502, "Model returned no questions")

        return build_response(200, {
            "domain": domain,
            "difficulty": difficulty,
            "questions": questions,
        })

    except ValueError as e:
        logger.warning(f"Validation/auth error: {e}")
        return error_response(401, str(e))
    except Exception as e:
        logger.error(f"Unhandled error in generate_questions: {e}", exc_info=True)
        return error_response(500, "Internal server error while generating questions")
