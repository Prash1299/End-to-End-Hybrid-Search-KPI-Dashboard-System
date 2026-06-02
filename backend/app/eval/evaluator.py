import json
import time

from app.search.hybrid import HybridSearch

print("Evaluation started")


search_engine = HybridSearch(
    "data/processed/docs.jsonl"
)


def precision_at_k(results, expected, k=5):

    relevant = 0

    for result in results[:k]:

        if expected.lower() in result["title"].lower():
            relevant += 1

    return relevant / k


def evaluate(alpha):

    with open(
        "app/eval/evaluation_queries.json",
        "r",
        encoding="utf-8"
    ) as f:

        queries = json.load(f)

    total_precision = 0
    total_latency = 0

    print("\n")
    print("=" * 60)
    print(f"EVALUATING alpha = {alpha}")
    print("=" * 60)

    for test in queries:

        query = test["query"]
        expected = test["expected_topic"]

        start = time.time()

        results = search_engine.query(
            search_query=query,
            top_k=5,
            alpha=alpha
        )

        latency = (time.time() - start) * 1000

        precision = precision_at_k(
            results,
            expected,
            k=5
        )

        total_precision += precision
        total_latency += latency

        print(f"\nQuery: {query}")
        print(f"Expected: {expected}")
        print(f"Precision@5: {precision:.2f}")
        print(f"Latency: {latency:.2f} ms")

    avg_precision = total_precision / len(queries)
    avg_latency = total_latency / len(queries)

    print("\n")
    print("=" * 60)
    print("FINAL RESULTS")
    print("=" * 60)

    print(f"Average Precision@5: {avg_precision:.2f}")
    print(f"Average Latency: {avg_latency:.2f} ms")


if __name__ == "__main__":

    evaluate(alpha=1.0)

    evaluate(alpha=0.0)

    evaluate(alpha=0.6)
