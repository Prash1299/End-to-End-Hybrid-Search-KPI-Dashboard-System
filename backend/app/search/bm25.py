import json
import os
from rank_bm25 import BM25Okapi


class BM25Index:
    def __init__(self):
        self.documents = []
        self.tokenized_corpus = []
        self.bm25 = None

    def load_documents(self, file_path):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"{file_path} not found")

        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                doc = json.loads(line)
                self.documents.append(doc)

        self.tokenized_corpus = [
            (doc["title"] + " " + doc["text"]).lower().split()
            for doc in self.documents
        ]

    def build(self):

        print("BUILD CORPUS:", self.tokenized_corpus)
        print("LENGTH:", len(self.tokenized_corpus))

        if not self.tokenized_corpus:
           raise ValueError("Tokenized corpus is empty")

        self.bm25 = BM25Okapi(self.tokenized_corpus)

    def query(self, search_query, top_k=5):
        if not self.bm25:
            raise ValueError("BM25 index not built")

        tokenized_query = search_query.lower().split()
        scores = self.bm25.get_scores(tokenized_query)

        ranked = sorted(
            zip(self.documents, scores),
            key=lambda x: x[1],
            reverse=True
        )[:top_k]

        results = []

        for doc, score in ranked:
            results.append({
                "doc_id": doc["doc_id"],
                "title": doc["title"],
                "text": doc["text"],
                "score": float(score)
            })

        return results
