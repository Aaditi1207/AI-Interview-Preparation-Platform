import json
import os
import sys
from unittest.mock import patch

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "save_results"))
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "common"))

import handler


def make_event(user_id="user-123"):
    return {
        "requestContext": {
            "authorizer": {"jwt": {"claims": {"sub": user_id}}}
        },
        "body": json.dumps({
            "domain": "Kubernetes",
            "difficulty": "Advanced",
            "questions": ["What is a Pod?"],
            "answers": ["A group of containers."],
            "score": 8,
            "feedback": {"summary": "Solid answer"},
            "email": "test@example.com",
        }),
    }


@patch("handler.save_interview_result")
@patch("handler.ensure_user_exists")
def test_save_results_success(mock_ensure_user, mock_save):
    mock_save.return_value = {"interview_id": "abc-123", "created_at": "2026-09-15T00:00:00Z"}

    response = handler.lambda_handler(make_event(), None)
    body = json.loads(response["body"])

    assert response["statusCode"] == 201
    assert body["interview_id"] == "abc-123"
    mock_ensure_user.assert_called_once()


def test_save_results_missing_fields():
    event = make_event()
    event["body"] = json.dumps({"domain": "Kubernetes"})  # missing required fields

    response = handler.lambda_handler(event, None)
    assert response["statusCode"] == 400
