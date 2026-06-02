import time
import numpy as np

print("Evaluation started")

from app.search.hybrid import HybridSearch
from app.eval.ground_truth import GROUND_TRUTH

search_engine = HybridSearch(
    docs_path="data/processed/docs.jsonl"
)


def precision_at_k(retrieved, relevant, k=5):
    retrieved_k = retrieved[:k]

    hits = sum(
        1 for doc_id in retrieved_k
        if doc_id in relevant
    )

    return hits / k


def recall_at_k(retrieved, relevant, k=5):
    retrieved_k = retrieved[:k]

    hits = sum(
        1 for doc_id in retrieved_k
        if doc_id in relevant
    )

    return hits / len(relevant)


def reciprocal_rank(retrieved, relevant):
    for rank, doc_id in enumerate(retrieved, start=1):
        if doc_id in relevant:
            return 1 / rank

    return 0


def dcg(relevances):
    return sum(
        rel / np.log2(idx + 2)
        for idx, rel in enumerate(relevances)
    )


def ndcg_at_k(retrieved, relevant, k=5):
    retrieved_k = retrieved[:k]

    relevances = [
        1 if doc_id in relevant else 0
        for doc_id in retrieved_k
    ]

    ideal = sorted(relevances, reverse=True)

    actual_dcg = dcg(relevances)
    ideal_dcg = dcg(ideal)

    if ideal_dcg == 0:
        return 0

    return actual_dcg / ideal_dcg


alphas = [0.0, 0.3, 0.6, 0.8, 1.0]

for alpha in alphas:

    precisions = []
    recalls = []
    mrrs = []
    ndcgs = []
    latencies = []

    print("\n")
    print("=" * 70)
    print(f"EVALUATING alpha = {alpha}")
    print("=" * 70)

    for item in GROUND_TRUTH:

        query = item["query"]
        relevant_docs = item["expected_docs"]

        start = time.time()

        results = search_engine.query(
            search_query=query,
            top_k=5,
            alpha=alpha
        )

        latency = (
            time.time() - start
        ) * 1000

        retrieved_docs = [
            int(result["doc_id"])
            for result in results
        ]

        p5 = precision_at_k(
            retrieved_docs,
            relevant_docs
        )

        r5 = recall_at_k(
            retrieved_docs,
            relevant_docs
        )

        rr = reciprocal_rank(
            retrieved_docs,
            relevant_docs
        )

        ndcg = ndcg_at_k(
            retrieved_docs,
            relevant_docs
        )

        precisions.append(p5)
        recalls.append(r5)
        mrrs.append(rr)
        ndcgs.append(ndcg)
        latencies.append(latency)

        print(f"\nQuery: {query}")
        print(f"Retrieved: {retrieved_docs}")
        print(f"Expected: {relevant_docs}")
        print(f"Precision@5: {p5:.2f}")
        print(f"Recall@5: {r5:.2f}")
        print(f"MRR: {rr:.2f}")
        print(f"NDCG@5: {ndcg:.2f}")
        print(f"Latency: {latency:.2f} ms")

    print("\n")
    print("=" * 70)
    print("FINAL RESULTS")
    print("=" * 70)

    print(
        f"Average Precision@5: "
        f"{np.mean(precisions):.2f}"
    )

    print(
        f"Average Recall@5: "
        f"{np.mean(recalls):.2f}"
    )

    print(
        f"Average MRR: "
        f"{np.mean(mrrs):.2f}"
    )

    print(
        f"Average NDCG@5: "
        f"{np.mean(ndcgs):.2f}"
    )

    print(
        f"Average Latency: "
        f"{np.mean(latencies):.2f} ms"
    )
    
avg_recall = sum(recalls) / len(recalls)
avg_mrr = sum(mrrs) / len(mrrs)
avg_ndcg = sum(ndcgs) / len(ndcgs)


import csv
import os
from datetime import datetime
import subprocess

os.makedirs("data/metrics", exist_ok=True)

csv_file = "data/metrics/experiments.csv"

commit = subprocess.check_output(
    ["git", "rev-parse", "--short", "HEAD"]
).decode().strip()

file_exists = os.path.isfile(csv_file)

with open(csv_file, "a", newline="") as f:

    writer = csv.writer(f)

    # Header only first time
    if not file_exists:
        writer.writerow([
            "timestamp",
            "alpha",
            "precision",
            "recall",
            "mrr",
            "ndcg",
            "latency_ms",
            "git_commit"
        ])

    writer.writerow([
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        alpha,
        avg_recall,
        avg_mrr,
        avg_ndcg,
        commit
    ])

print("Results appended to data/metrics/experiments.csv")
