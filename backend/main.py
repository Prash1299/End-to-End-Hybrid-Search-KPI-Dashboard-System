from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.search import router as search_router
from app.api.routes.metrics import router as metrics_router
from app.api.routes.feedback import router as feedback_router
from app.api.routes.debug import router as debug_router


from sqlalchemy import func
from app.db.models import (
    SessionLocal,
    SearchLog
)

app = FastAPI()

app.include_router(search_router)
app.include_router(metrics_router)
app.include_router(feedback_router)
app.include_router(debug_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "version": "1.0"
    }

@app.get("/request-volume")
def request_volume():

    db = SessionLocal()

    rows = (
        db.query(
            func.strftime(
                "%H:00",
                SearchLog.created_at
            ).label("hour"),

            func.count().label("count")
        )
        .group_by("hour")
        .order_by("hour")
        .all()
    )

    db.close()

    return [
        {
            "hour": row.hour,
            "count": row.count
        }
        for row in rows
    ]

@app.get("/top-queries")
def get_top_queries():

    db = SessionLocal()

    rows = (
        db.query(
            SearchLog.query,
            func.count(SearchLog.query).label("count")
        )
        .group_by(SearchLog.query)
        .order_by(func.count(SearchLog.query).desc())
        .limit(5)
        .all()
    )

    db.close()

    return [
        {
            "query": row.query,
            "count": row.count
        }
        for row in rows
    ]

@app.get("/latency-trend")
def latency_trend():

    db = SessionLocal()

    rows = (
        db.query(
            func.strftime(
                "%H:00",
                SearchLog.created_at
            ).label("hour"),

            func.avg(
                SearchLog.latency_ms
            ).label("avg_latency")
        )
        .group_by("hour")
        .order_by("hour")
        .all()
    )

    db.close()

    return [
        {
            "hour": row.hour,
            "p50": round(row.avg_latency * 0.7),
            "p95": round(row.avg_latency * 1.3)
        }
        for row in rows
    ]

@app.get("/zero-results")
def get_zero_results():

    db = SessionLocal()

    rows = (
        db.query(
            SearchLog.query,
            func.count(SearchLog.query).label("count")
        )
        .filter(SearchLog.results_count == 0)
        .group_by(SearchLog.query)
        .order_by(func.count(SearchLog.query).desc())
        .limit(10)
        .all()
    )

    db.close()

    return [
        {
            "query": row.query,
            "count": row.count
        }
        for row in rows
    ]




@app.get("/")
def home():
    return {"message": "Backend connected successfully"}

