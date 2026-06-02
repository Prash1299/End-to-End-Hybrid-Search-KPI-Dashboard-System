from fastapi import APIRouter
from app.db.database import SessionLocal
from app.db.models import ErrorLog

router = APIRouter()

@router.get("/logs")
def get_logs():

    db = SessionLocal()

    logs = (
        db.query(ErrorLog)
        .order_by(ErrorLog.timestamp.desc())
        .all()
    )

    db.close()

    return [
        {
            "timestamp": str(log.timestamp),
            "severity": log.severity,
            "source": log.source,
            "message": log.message
        }
        for log in logs
    ]
