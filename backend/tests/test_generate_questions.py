import json
import os
import sys
from unittest.mock import patch, MagicMock

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "generate_questions"))
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "common"))

import handler


def make_event(domain="AWS", difficulty="Beginner", num_questions=3, user_id="user-123"):
    return {
        "requestContext": {
            "authorizer": {"jwt": {"claims": {"sub": user_id}}}
        },
        "body": json.dumps({
            "domain": domain,
            "difficulty": difficulty,
            "num_questions": num_questions,
        }),
    }


@patch("handler.bedrock_client.invoke_model")
def test_generate_questions_success(mock_invoke):
    mock_invoke.return_value = json.dumps({
        "questions": ["What is an S3 bucket?", "Explain IAM roles.", "What is a VPC?"]
    })

    response = handler.lambda_handler(make_event(), None)
    body = json.loads(response["body"])

    assert response["statusCode"] == 200
    assert len(body["questions"]) == 3


def test_generate_questions_invalid_domain():
    event = make_event(domain="InvalidDomain")
    response = handler.lambda_handler(event, None)

    assert response["statusCode"] == 400


def test_generate_questions_missing_auth():
    event = make_event()
    del event["requestContext"]["authorizer"]

    response = handler.lambda_handler(event, None)
    assert response["statusCode"] == 401
