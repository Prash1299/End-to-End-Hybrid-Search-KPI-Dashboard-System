from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    create_engine
)

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from datetime import datetime

DATABASE_URL = "sqlite:///./search_logs.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


class SearchLog(Base):
    __tablename__ = "search_logs"

    id = Column(Integer, primary_key=True, index=True)

    query = Column(String)
    latency_ms = Column(Float)
    results_count = Column(Integer)
    alpha = Column(Float)
    top_k = Column(Integer)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class ErrorLog(Base):
    __tablename__ = "error_logs"

    id = Column(Integer, primary_key=True)

    timestamp = Column(DateTime)

    severity = Column(String)

    source = Column(String)

    message = Column(String)


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)

    query = Column(String)

    doc_id = Column(String)

    relevance = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


Base.metadata.create_all(bind=engine)
