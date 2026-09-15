import json
import os
import sys
from unittest.mock import patch

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "evaluate_answers"))
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "common"))

import handler


def make_event(qa_pairs, user_id="user-123"):
    return {
        "requestContext": {
            "authorizer": {"jwt": {"claims": {"sub": user_id}}}
        },
        "body": json.dumps({
            "domain": "DevOps",
            "difficulty": "Intermediate",
            "qa_pairs": qa_pairs,
        }),
    }


@patch("handler.bedrock_client.invoke_model")
def test_evaluate_answers_success(mock_invoke):
    mock_invoke.return_value = json.dumps({
        "score": 7,
        "feedback": "Good understanding overall.",
        "ideal_answer": "A CI/CD pipeline automates build, test, deploy.",
        "improvements": "Mention rollback strategies."
    })

    event = make_event([{"question": "What is CI/CD?", "answer": "It automates deployments."}])
    response = handler.lambda_handler(event, None)
    body = json.loads(response["body"])

    assert response["statusCode"] == 200
    assert body["average_score"] == 7
    assert len(body["evaluations"]) == 1


def test_evaluate_answers_empty_answer_skips_bedrock():
    event = make_event([{"question": "What is Docker?", "answer": ""}])
    response = handler.lambda_handler(event, None)
    body = json.loads(response["body"])

    assert response["statusCode"] == 200
    assert body["evaluations"][0]["score"] == 0


def test_evaluate_answers_missing_qa_pairs():
    event = make_event([])
    response = handler.lambda_handler(event, None)
    assert response["statusCode"] == 400
