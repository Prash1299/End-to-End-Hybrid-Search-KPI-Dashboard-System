from fastapi import APIRouter
from app.db.database import SessionLocal
from app.db.models import ErrorLog
from sqlalchemy import func

router = APIRouter()







@router.get("/trend")

def get_trend():

    db = SessionLocal()

    rows = (
        db.query(
            func.strftime(
                "%H:00",
                ErrorLog.timestamp
            ).label("hour"),
            func.count().label("errors")
        )
        .group_by("hour")
        .order_by("hour")
        .all()
    )

    db.close()

    return [
        {
            "hour": row.hour,
            "errors": row.errors
        }
        for row in rows
    ]

@router.get("/distribution")
def get_distribution():

    db = SessionLocal()

    rows = (
        db.query(
            ErrorLog.severity,
            func.count().label("count")
        )
        .group_by(ErrorLog.severity)
        .all()
    )

    db.close()

    return [
        {
            "name": row.severity,
            "value": row.count
        }
        for row in rows
    ]

@router.get("/stats")
def get_stats():

    db = SessionLocal()

    total_logs = db.query(ErrorLog).count()

    errors = (
        db.query(ErrorLog)
        .filter(ErrorLog.severity == "ERROR")
        .count()
    )

    warnings = (
        db.query(ErrorLog)
        .filter(ErrorLog.severity == "WARNING")
        .count()
    )

    critical = (
        db.query(ErrorLog)
        .filter(ErrorLog.severity == "CRITICAL")
        .count()
    )

    db.close()

    return {
        "total_logs": total_logs,
        "errors": errors,
        "warnings": warnings,
        "critical": critical
    }

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
