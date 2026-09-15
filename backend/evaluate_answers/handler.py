import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "common"))

import bedrock_client
from prompt_templates import answer_evaluation_prompt
from response_utils import build_response, error_response, get_user_id, parse_body
from logger import get_logger

logger = get_logger(__name__)


def lambda_handler(event, context):
    try:
        user_id = get_user_id(event)
        body = parse_body(event)

        domain = body.get("domain")
        difficulty = body.get("difficulty")
        qa_pairs = body.get("qa_pairs")  # [{ "question": "...", "answer": "..." }, ...]

        if not domain or not difficulty:
            return error_response(400, "domain and difficulty are required")
        if not qa_pairs or not isinstance(qa_pairs, list):
            return error_response(400, "qa_pairs must be a non-empty list of {question, answer}")

        logger.info(f"Evaluating {len(qa_pairs)} answers for user {user_id} ({domain}/{difficulty})")

        evaluations = []
        total_score = 0

        for pair in qa_pairs:
            question = pair.get("question", "")
            answer = pair.get("answer", "")

            if not answer.strip():
                evaluations.append({
                    "question": question,
                    "score": 0,
                    "feedback": "No answer was provided.",
                    "ideal_answer": "",
                    "improvements": "Attempt the question to receive feedback.",
                })
                continue

            prompt = answer_evaluation_prompt(domain, difficulty, question, answer)
            raw_output = bedrock_client.invoke_model(prompt, max_tokens=1000, temperature=0.4)
            parsed = bedrock_client.extract_json(raw_output)

            score = int(parsed.get("score", 0))
            total_score += score

            evaluations.append({
                "question": question,
                "answer": answer,
                "score": score,
                "feedback": parsed.get("feedback", ""),
                "ideal_answer": parsed.get("ideal_answer", ""),
                "improvements": parsed.get("improvements", ""),
            })

        average_score = round(total_score / len(qa_pairs), 2) if qa_pairs else 0

        return build_response(200, {
            "domain": domain,
            "difficulty": difficulty,
            "average_score": average_score,
            "evaluations": evaluations,
        })

    except ValueError as e:
        logger.warning(f"Validation/auth error: {e}")
        return error_response(401, str(e))
    except Exception as e:
        logger.error(f"Unhandled error in evaluate_answers: {e}", exc_info=True)
        return error_response(500, "Internal server error while evaluating answers")
