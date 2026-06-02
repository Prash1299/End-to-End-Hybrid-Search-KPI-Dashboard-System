import time

from fastapi import APIRouter
from pydantic import BaseModel

from app.search.hybrid import HybridSearch

from app.db.database import SessionLocal
from app.db.models import SearchLog

import uuid
import json
import logging

logging.basicConfig(
    filename="search_logs.jsonl",
    level=logging.INFO,
    format="%(message)s"
)

router = APIRouter()

#search_engine = HybridSearch("data/processed/docs.jsonl")
search_engine = None

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    alpha: float = 0.5


@router.post("/search")
def search(request: SearchRequest):

    start_time = time.time()
    request_id = str(uuid.uuid4())
    print("Generated Request ID:", request_id)

    try:

        global search_engine

        if search_engine is None:
            print("Loading Hybrid Search...")
            search_engine = HybridSearch("data/processed/docs.jsonl")

        results = search_engine.query(
            search_query=request.query,
            top_k=request.top_k,
            alpha=request.alpha
        )

        latency_ms = (time.time() - start_time) * 1000

        db = SessionLocal()

        log = SearchLog(
            query=request.query,
            alpha=request.alpha,
            top_k=request.top_k,
            latency_ms=latency_ms,
            results_count=len(results)
        )

        db.add(log)
        db.commit()
        db.close()

        logging.info(
            json.dumps({
                "request_id": request_id,
                "query": request.query,
                "latency_ms": round(latency_ms, 2),
                "top_k": request.top_k,
                "alpha": request.alpha,
                "result_count": len(results),
                "error": None
            })
        )

        return {
            "query": request.query,
            "latency_ms": latency_ms,
            "results": results
        }

    except Exception as e:

        latency_ms = (time.time() - start_time) * 1000

        logging.error(
            json.dumps({
                "request_id": request_id,
                "query": request.query,
                "latency_ms": round(latency_ms, 2),
                "top_k": request.top_k,
                "alpha": request.alpha,
                "result_count": 0,
                "error": str(e)
            })
        )

        raise e
