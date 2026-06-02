from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_metrics_endpoint():

    response = client.get("/metrics")

    assert response.status_code == 200

    data = response.json()

    assert "total_searches" in data
    assert "average_latency_ms" in data
    assert "zero_result_queries" in data
    assert "top_queries" in data
