from app.search.bm25 import BM25Index
from app.search.vector import VectorIndex


class HybridSearch:
    def __init__(self, docs_path):
        self.bm25 = BM25Index()
        self.vector = VectorIndex()

        self.bm25.load_documents(docs_path)
        self.bm25.build()

        self.vector.load_documents(docs_path)
        self.vector.build()

    def normalize_scores(self, scores):
        
        min_score = min(scores)
        max_score = max(scores)

        if max_score == min_score:
            return [0.0 for _ in scores]

        return [
            (score - min_score) / (max_score - min_score)
            for score in scores
        ]

    def query(self, search_query, top_k=5, alpha=0.5):
        bm25_results = self.bm25.query(search_query, top_k=top_k)
        vector_results = self.vector.query(search_query, top_k=top_k)

        bm25_scores = [r["score"] for r in bm25_results]

        # lower distance = better similarity
        vector_scores = [-r["similarity"] for r in vector_results]

        norm_bm25 = self.normalize_scores(bm25_scores)
        norm_vector = self.normalize_scores(vector_scores)

        combined = {}

        for result, score in zip(bm25_results, norm_bm25):
            doc_id = result["doc_id"]
            combined[doc_id] = {
                "doc_id": doc_id,
                "title": result["title"],
                "text": result.get("text", "Preview unavailable")[:220],
                "bm25_score": result["score"],
                "vector_score": 0.0,
                "hybrid_score": alpha * score
            }

        for result, score in zip(vector_results, norm_vector):
            doc_id = result["doc_id"]

            if doc_id in combined:
                combined[doc_id]["vector_score"] = result["similarity"]
                combined[doc_id]["hybrid_score"] += (1 - alpha) * score
            else:
                combined[doc_id] = {
                    "doc_id": doc_id,
                    "title": result["title"],
                    "text": result.get("text", "Preview unavailable")[:220],
                    "bm25_score": 0.0,
                    "vector_score": result["similarity"],
                    "hybrid_score": (1 - alpha) * score
                }

        ranked = sorted(
            combined.values(),
            key=lambda x: x["hybrid_score"],
            reverse=True
        )

        return ranked[:top_k]
