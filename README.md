#Here's a professional `README.md` suitable for your Kearney Hybrid Search Assignment.

# Hybrid Search Dashboard

A full-stack Hybrid Search System that combines **BM25 lexical retrieval** and **semantic vector search** using Sentence Transformers and FAISS. The application includes a FastAPI backend, React dashboard, evaluation framework, feedback collection, analytics, and observability features.

---

# Project Overview

This project implements a production-inspired retrieval system that:

* Performs hybrid retrieval using BM25 and vector embeddings
* Supports configurable hybrid weighting (alpha)
* Evaluates retrieval quality using ranking metrics
* Collects user relevance feedback
* Tracks search analytics and latency
* Stores logs in SQLite
* Provides a React-based dashboard for visualization

---

# System Architecture

```text
┌────────────────────┐
│   React Frontend   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   FastAPI Backend  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Hybrid Search Core │
└──────┬───────┬─────┘
       │       │
       ▼       ▼
   BM25      FAISS +
 Retrieval  Embeddings
       │       │
       └───┬───┘
           ▼
     Score Fusion
           ▼
     Ranked Results
```

---

# Features

## Search Engine

* BM25 lexical retrieval
* Sentence Transformer semantic retrieval
* FAISS vector indexing
* Hybrid score fusion
* Adjustable alpha weighting

## Evaluation Harness

* Precision@K
* Recall@K
* MRR
* nDCG
* Multiple experiment tracking

## Analytics Dashboard

* Total searches
* Average latency
* Top queries
* Query analytics
* Experiment visualization

## Feedback Collection

* Relevant / Not Relevant feedback
* Feedback persistence in SQLite
* Search quality monitoring

## Observability

* Query logging
* Latency tracking
* Result count tracking
* Search analytics

---

# Technology Stack

## Frontend

* React
* Vite
* Axios
* Chart.js

## Backend

* FastAPI
* SQLAlchemy
* SQLite
* Pydantic

## Retrieval

* Rank-BM25
* Sentence Transformers
* FAISS
* NumPy

---

# Repository Structure

```text
kearney-assignment/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── search.py
│   │   │       ├── feedback.py
│   │   │       └── metrics.py
│   │   │
│   │   ├── search/
│   │   │   ├── bm25.py
│   │   │   ├── vector.py
│   │   │   └── hybrid.py
│   │   │
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── models.py
│   │   │
│   │   └── eval/
│   │       └── evaluate.py
│   │
│   ├── data/
│   │   ├── processed/
│   │   ├── eval/
│   │   └── metrics/
│   │
│   └── tests/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   └── break_fix_log.md
│
└── README.md
```

---

# Setup Instructions

## Backend Setup

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn main:app
```

Backend URL:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# API Endpoints

## Health Check

```http
GET /health
```

Response:

```json
{
  "status": "healthy",
  "service": "Hybrid Search API"
}
```

---

## Search

```http
POST /search
```

Request:

```json
{
  "query": "transformers",
  "top_k": 5,
  "alpha": 0.6
}
```

---

## Feedback

```http
POST /feedback
```

Request:

```json
{
  "query": "transformers",
  "doc_id": 74,
  "relevant": true
}
```

---

## Metrics

```http
GET /metrics
```

Returns analytics and dashboard statistics.

---

# Evaluation Results

| Alpha | Precision@5 | Recall@5 | MRR  | nDCG@5 |
| ----- | ----------- | -------- | ---- | ------ |
| 0.0   | 0.89        | 0.17     | 0.91 | 0.94   |
| 0.3   | 0.89        | 0.17     | 0.86 | 0.92   |
| 0.6   | 0.89        | 0.17     | 0.93 | 0.93   |
| 1.0   | 0.87        | 0.16     | 0.91 | 0.91   |

Best-performing configuration:

```text
Alpha = 0.6
```

---

# Database Schema

## Search Logs

```sql
CREATE TABLE search_logs (
    id INTEGER PRIMARY KEY,
    query TEXT,
    alpha REAL,
    top_k INTEGER,
    latency_ms REAL,
    results_count INTEGER
);
```

## Feedback Logs

```sql
CREATE TABLE feedback_logs (
    id INTEGER PRIMARY KEY,
    query TEXT,
    doc_id INTEGER,
    relevant BOOLEAN
);
```

---

# Error Injection & Recovery

Implemented break-and-fix scenarios:

### Scenario A

Semantic index mismatch

* Injected model mismatch
* Observed retrieval failure
* Added validation checks

### Scenario B

Schema migration break

* Modified database schema
* Observed write failures
* Applied migration script

### Scenario C

Hybrid scoring regression

* Removed normalization guard
* Triggered scoring failure
* Restored divide-by-zero protection

Detailed logs available in:

```text
docs/break_fix_log.md
```

---

# Future Improvements

* Incremental indexing
* Query caching
* Redis integration
* Authentication
* Advanced monitoring
* Online relevance learning
* Experiment tracking dashboard
* Model versioning

---

# Author

Prashant Singh

IIT Bombay

Hybrid Search Dashboard – Kearney Assignment

This version is suitable for a GitHub repository and demonstrates both the retrieval-system work and the engineering aspects of the assignment.
