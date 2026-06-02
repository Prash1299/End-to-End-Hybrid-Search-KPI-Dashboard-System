# Scenario A

## Failure
I intentionally changed the embedding model from:

SentenceTransformer("all-MiniLM-L6-v2")

to:

SentenceTransformer("all-mpnet-base-v2")

without rebuilding the cached embeddings and FAISS index.

## Error
Backend startup failed with:

ValueError: Model mismatch detected

## Root Cause
The FAISS index and cached embeddings were generated using the MiniLM model (384 dimensions), while the new model generated embeddings with a different dimensionality. This created an inconsistency between stored vectors and newly generated query vectors.

## Fix
Added metadata validation during startup:

Stored embedding model name in embeddings_meta.json
Stored embedding dimension
Validated model name and dimension before loading cached embeddings

## Result
System now detects incompatible embedding caches and prevents invalid retrieval behavior.

---

# Scenario B

## Failure
Added a new field to the SearchLog model:

experiment_name = Column(String, nullable=False)

without updating the SQLite database schema.

## Error
Search requests failed with:

sqlite3.OperationalError

Database inserts could no longer be completed.

## Root Cause
SQLAlchemy model definition and SQLite table schema were out of sync.

## Fix
Created a migration script:

ALTER TABLE search_logs
ADD COLUMN experiment_name TEXT

Executed the migration and restarted the backend.

## Result
Database schema and application models were synchronized successfully.

---

# Scenario C

## Failure
Removed the protection inside normalize_scores():

if max_score == min_score:
    return [0.0 for _ in scores]

## Error
Hybrid score normalization produced invalid values when all retrieval scores were identical.

Potential failures included:

ZeroDivisionError

or invalid ranking behavior.

## Root Cause
Normalization formula:

(score - min_score) / (max_score - min_score)

causes division by zero when all scores are equal.

## Fix
Restored guard clause:

if max_score == min_score:
    return [0.0 for _ in scores]

## Result
Hybrid scoring became robust against equal-score edge cases.
