from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_feedback_endpoint():

    response = client.post(
        "/feedback",
        json={
            "query": "transformers",
            "doc_id": 17,
            "relevance": "relevant"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Feedback saved"
