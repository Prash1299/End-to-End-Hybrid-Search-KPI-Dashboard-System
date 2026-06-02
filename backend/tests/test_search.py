from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_search_endpoint():

    response = client.post(
        "/search",
        json={
            "query": "transformers",
            "top_k": 5,
            "alpha": 0.6
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "results" in data
    assert len(data["results"]) > 0


def test_search_result_fields():

    response = client.post(
        "/search",
        json={
            "query": "agentic ai",
            "top_k": 3,
            "alpha": 0.5
        }
    )

    data = response.json()

    result = data["results"][0]

    assert "doc_id" in result
    assert "title" in result
    assert "bm25_score" in result
    assert "vector_score" in result
    assert "hybrid_score" in result
