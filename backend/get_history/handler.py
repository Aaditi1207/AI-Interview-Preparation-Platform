import sys
import os
from collections import defaultdict

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "common"))

from dynamo_client import get_user_history
from response_utils import build_response, error_response, get_user_id
from logger import get_logger

logger = get_logger(__name__)


def lambda_handler(event, context):
    try:
        user_id = get_user_id(event)

        query_params = event.get("queryStringParameters") or {}
        limit = int(query_params.get("limit", 50))

        history = get_user_history(user_id, limit=limit)

        total_interviews = len(history)
        avg_score = (
            round(sum(float(h.get("score", 0)) for h in history) / total_interviews, 2)
            if total_interviews > 0 else 0
        )

        domain_stats = defaultdict(lambda: {"count": 0, "total_score": 0})
        for h in history:
            d = h.get("domain", "Unknown")
            domain_stats[d]["count"] += 1
            domain_stats[d]["total_score"] += float(h.get("score", 0))

        domain_performance = {
            domain: {
                "interviews": stats["count"],
                "average_score": round(stats["total_score"] / stats["count"], 2),
            }
            for domain, stats in domain_stats.items()
        }

        # Trend: chronological score sequence (history is newest-first, so reverse it)
        trend = [
            {"date": h.get("created_at"), "score": float(h.get("score", 0))}
            for h in reversed(history)
        ]

        logger.info(f"Fetched {total_interviews} history records for user {user_id}")

        return build_response(200, {
            "total_interviews": total_interviews,
            "average_score": avg_score,
            "domain_performance": domain_performance,
            "improvement_trend": trend,
            "recent_interviews": history[:10],
        })

    except ValueError as e:
        logger.warning(f"Validation/auth error: {e}")
        return error_response(401, str(e))
    except Exception as e:
        logger.error(f"Unhandled error in get_history: {e}", exc_info=True)
        return error_response(500, "Internal server error while fetching history")
