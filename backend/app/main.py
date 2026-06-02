from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.feedback import router as feedback_router

from app.api.router import api_router

from app.db.database import engine
from app.db.models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hybrid Search API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(feedback_router)
