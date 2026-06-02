from fastapi import APIRouter
from sqlalchemy import func

from app.db.database import SessionLocal
from app.db.models import SearchLog

import numpy as np

router = APIRouter()


@router.get("/metrics")
def get_metrics():

    db = SessionLocal()

    total_searches = db.query(SearchLog).count()

    latencies = [
    row.latency_ms
    for row in db.query(SearchLog).all()
    ]

    avg_latency = db.query(
        func.avg(SearchLog.latency_ms)
    ).scalar()

    p50_latency = (
    float(np.percentile(latencies, 50))
    if latencies else 0
     )

    p95_latency = (
    float(np.percentile(latencies, 95))
    if latencies else 0
     )

    top_queries = (
        db.query(
            SearchLog.query,
            func.count(SearchLog.query).label("count")
        )
        .group_by(SearchLog.query)
        .order_by(func.count(SearchLog.query).desc())
        .limit(5)
        .all()
    )

    zero_result_queries = (
        db.query(SearchLog)
        .filter(SearchLog.results_count == 0)
        .count()
    )

    db.close()

    return {
        "total_searches": total_searches,
        "average_latency_ms": round(avg_latency or 0, 2),
        "p50_latency_ms": p50_latency,
        "p95_latency_ms": p95_latency,
        "zero_result_queries": zero_result_queries,
        "top_queries": [
            {
                "query": q[0],
                "count": q[1]
            }
            for q in top_queries
        ]
    }
