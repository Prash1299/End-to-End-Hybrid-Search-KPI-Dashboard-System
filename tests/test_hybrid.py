from app.search.hybrid import HybridSearch


def test_normalize_scores():

    hybrid = HybridSearch.__new__(HybridSearch)

    scores = [10, 20, 30]

    normalized = hybrid.normalize_scores(scores)

    assert normalized[0] == 0.0
    assert normalized[-1] == 1.0


def test_equal_scores():

    hybrid = HybridSearch.__new__(HybridSearch)

    scores = [5, 5, 5]

    normalized = hybrid.normalize_scores(scores)

    assert normalized == [0.0, 0.0, 0.0]
