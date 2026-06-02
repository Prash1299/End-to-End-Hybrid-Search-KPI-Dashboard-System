import json
import random
from collections import defaultdict

# INPUT FILE
DOCS_PATH = "backend/data/processed/docs.jsonl"

# OUTPUT FILES
QUERIES_OUT = "backend/data/eval/queries.jsonl"
QRELS_OUT = "backend/data/eval/qrels.json"

# 25 evaluation queries
queries = [
    "machine learning",
    "deep learning",
    "transformers",
    "large language models",
    "semantic retrieval",
    "question answering",
    "cybersecurity",
    "cloud computing",
    "workflow automation",
    "enterprise AI",
    "medical imaging",
    "disease prediction",
    "AI diagnostics",
    "attention mechanisms",
    "distributed systems",
    "multi-agent systems",
    "software engineering",
    "data analytics",
    "natural language processing",
    "neural networks",
    "hospital resource allocation",
    "fraud detection",
    "image classification",
    "translation systems",
    "anomaly detection"
]

# Load docs
docs = []

with open(DOCS_PATH, "r", encoding="utf-8") as f:
    for line in f:
        docs.append(json.loads(line))

# Build qrels
qrels = defaultdict(list)

for query in queries:
    query_words = query.lower().split()

    for doc in docs:
        text = (doc["title"] + " " + doc["text"]).lower()

        # Simple keyword matching
        matches = sum(word in text for word in query_words)

        if matches >= 1:
            qrels[query].append(doc["doc_id"])

    # Keep max 10 relevant docs
    qrels[query] = qrels[query][:10]

# Save queries.jsonl
with open(QUERIES_OUT, "w", encoding="utf-8") as f:
    for q in queries:
        f.write(json.dumps({"query": q}) + "\n")

# Save qrels.json
with open(QRELS_OUT, "w", encoding="utf-8") as f:
    json.dump(qrels, f, indent=2)

print("Generated:")
print(f"- {QUERIES_OUT}")
print(f"- {QRELS_OUT}")

print(f"\nTotal Queries: {len(queries)}")

