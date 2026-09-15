import json
import os
import boto3
from botocore.exceptions import ClientError

from logger import get_logger

logger = get_logger(__name__)

_bedrock_runtime = boto3.client("bedrock-runtime")

MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "amazon.nova-lite-v1:0")


def invoke_model(prompt: str, max_tokens: int = 1500, temperature: float = 0.7) -> str:
    """
    Invokes Amazon Bedrock (Nova Lite) with a text prompt and returns
    the raw text output. Raises on failure.
    """
    request_body = {
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}]
            }
        ],
        "inferenceConfig": {
            "maxTokens": max_tokens,
            "temperature": temperature,
            "topP": 0.9,
        },
    }

    try:
        response = _bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json",
        )
        response_body = json.loads(response["body"].read())
        output_text = response_body["output"]["message"]["content"][0]["text"]
        return output_text

    except ClientError as e:
        logger.error(f"Bedrock ClientError: {e.response['Error']['Message']}")
        raise
    except (KeyError, IndexError) as e:
        logger.error(f"Unexpected Bedrock response shape: {e}")
        raise


def extract_json(raw_text: str) -> dict:
    """
    Bedrock models sometimes wrap JSON in markdown fences or add
    preamble text. This extracts the first valid JSON object found.
    """
    text = raw_text.strip()

    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1 or end < start:
        raise ValueError(f"No JSON object found in model output: {raw_text[:200]}")

    json_str = text[start:end + 1]
    return json.loads(json_str)
