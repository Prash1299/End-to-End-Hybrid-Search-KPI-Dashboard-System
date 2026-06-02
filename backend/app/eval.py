import json
import argparse
from collections import defaultdict
from math import log2

# ----------------------------
# LOAD FILES
# ----------------------------

def load_queries(path):
    queries = []

    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            queries.append(json.loads(line)["query"])

    return queries


def load_qrels(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_docs():
    docs = []

    with open("backend/data/processed/docs.jsonl", "r", encoding="utf-8") as f:
        for line in f:
            docs.append(json.loads(line))

    return docs


# ----------------------------
# SIMPLE SEARCH
# ----------------------------

def search(query, docs, top_k=10):
    results = []

    query_words = query.lower().split()

    for doc in docs:
        text = (doc["title"] + " " + doc["text"]).lower()

        score = sum(word in text for word in query_words)

        if score > 0:
            results.append((doc["doc_id"], score))

    results.sort(key=lambda x: x[1], reverse=True)

    return [doc_id for doc_id, _ in results[:top_k]]


# ----------------------------
# METRICS
# ----------------------------

def recall_at_k(retrieved, relevant, k=10):
    retrieved_k = retrieved[:k]

    hits = len(set(retrieved_k) & set(relevant))

    return hits / len(relevant) if relevant else 0


def mrr_at_k(retrieved, relevant, k=10):
    retrieved_k = retrieved[:k]

    for rank, doc_id in enumerate(retrieved_k, start=1):
        if doc_id in relevant:
            return 1 / rank

    return 0


def ndcg_at_k(retrieved, relevant, k=10):
    dcg = 0

    for i, doc_id in enumerate(retrieved[:k], start=1):
        if doc_id in relevant:
            dcg += 1 / log2(i + 1)

    ideal_hits = min(len(relevant), k)

    idcg = sum(1 / log2(i + 1) for i in range(1, ideal_hits + 1))

    return dcg / idcg if idcg > 0 else 0


# ----------------------------
# MAIN
# ----------------------------

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--queries", required=True)
    parser.add_argument("--qrels", required=True)

    args = parser.parse_args()

    queries = load_queries(args.queries)

    qrels = load_qrels(args.qrels)

    docs = load_docs()

    recall_scores = []
    mrr_scores = []
    ndcg_scores = []

    for query in queries:
        retrieved = search(query, docs)

        relevant = qrels.get(query, [])

        recall_scores.append(
            recall_at_k(retrieved, relevant)
        )

        mrr_scores.append(
            mrr_at_k(retrieved, relevant)
        )

        ndcg_scores.append(
            ndcg_at_k(retrieved, relevant)
        )

    avg_recall = sum(recall_scores) / len(recall_scores)
    avg_mrr = sum(mrr_scores) / len(mrr_scores)
    avg_ndcg = sum(ndcg_scores) / len(ndcg_scores)

    print("\n===== EVALUATION RESULTS =====\n")

    print(f"Recall@10 : {avg_recall:.4f}")
    print(f"MRR@10    : {avg_mrr:.4f}")
    print(f"nDCG@10   : {avg_ndcg:.4f}")


if __name__ == "__main__":
    main()
