from fastapi import APIRouter
from pydantic import BaseModel

from app.db.models import (
    SessionLocal,
    Feedback
)

router = APIRouter()


class FeedbackRequest(BaseModel):
    query: str
    doc_id: int
    relevance: str


@router.post("/feedback")
def submit_feedback(data: FeedbackRequest):

    db = SessionLocal()

    feedback = Feedback(
        query=data.query,
        doc_id=data.doc_id,
        relevance=data.relevance
    )

    db.add(feedback)
    db.commit()

    return {
        "message": "Feedback saved"
    }
