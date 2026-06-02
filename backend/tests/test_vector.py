from app.search.vector import VectorIndex


def test_vector_query():

    vector = VectorIndex()

    vector.documents = [
        {
            "doc_id": 1,
            "title": "Transformers",
            "text": "neural networks"
        },
        {
            "doc_id": 2,
            "title": "Cooking",
            "text": "food recipes"
        }
    ]

    vector.build()

    results = vector.query("machine learning")

    assert len(results) > 0
