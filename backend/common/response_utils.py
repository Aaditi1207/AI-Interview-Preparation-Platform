import json
from decimal import Decimal


class DecimalEncoder(json.JSONEncoder):
    """Handles DynamoDB Decimal types when serializing to JSON."""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super().default(obj)


def build_response(status_code: int, body: dict, headers: dict = None) -> dict:
    """Standard API Gateway HTTP API response builder."""
    default_headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    }
    if headers:
        default_headers.update(headers)

    return {
        "statusCode": status_code,
        "headers": default_headers,
        "body": json.dumps(body, cls=DecimalEncoder),
    }


def error_response(status_code: int, message: str) -> dict:
    return build_response(status_code, {"error": message})


def get_user_id(event: dict) -> str:
    """
    Extracts the authenticated user's sub (user_id) from the API Gateway
    JWT authorizer context. Never trust a client-supplied user_id.
    """
    try:
        return event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
    except KeyError:
        raise ValueError("Unable to resolve user_id from request context")


def parse_body(event: dict) -> dict:
    """Safely parses the JSON body of an API Gateway event."""
    body = event.get("body")
    if not body:
        return {}
    if isinstance(body, dict):
        return body
    return json.loads(body)
