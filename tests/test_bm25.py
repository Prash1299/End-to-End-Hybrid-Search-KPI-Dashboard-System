from app.search.bm25 import BM25Index


def test_bm25_query():

    bm25 = BM25Index()

    bm25.documents = [
        {
            "doc_id": 1,
            "title": "Transformers",
            "text": "transformers neural network"
        },
        {
            "doc_id": 2,
            "title": "Databases",
            "text": "sql database"
        }
    ]

    bm25.tokenized_corpus = [
        (doc["title"] + " " + doc["text"]).lower().split()
        for doc in bm25.documents
    ]

    print(bm25.tokenized_corpus)

    bm25.build()

    results = bm25.query("transformers")

    assert len(results) > 0
    assert results[0]["doc_id"] == 1
