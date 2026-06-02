import json

with open("data/processed/docs.jsonl", "r", encoding="utf-8") as f:
    docs = [json.loads(line) for line in f]

topics = [
    "transformers",
    "Agentic AI",
    "semantic search",
    "cloud computing",
    "cector databases",
    "rag systems",
    "machine learning",
    "healthcare aI",
    "financial technology",
    "cybersecurity",
    "fastapi",
]

for topic in topics:
    print("\n")
    print("=" * 50)
    print(topic)
    print("=" * 50)

    count = 0

    for doc in docs:
        if topic in doc["title"]:
            print(doc["doc_id"], doc["title"])

            count += 1

            if count == 5:
                break
