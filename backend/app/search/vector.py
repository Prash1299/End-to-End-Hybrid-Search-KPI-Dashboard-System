import json
import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


class VectorIndex:
    def __init__(self):
        self.documents = []
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = None
        self.embeddings = None

    def load_documents(self, file_path):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"{file_path} not found")

        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                doc = json.loads(line)
                self.documents.append(doc)

    def build(self):

        if (
             os.path.exists("embeddings.npy")
             and len(np.load("embeddings.npy")) == len(self.documents)
         ):

           print("Loading cached embeddings...")

           self.embeddings = np.load("embeddings.npy")

        else:

           print("Creating embeddings...")

           texts = [
            doc["title"] + " " + doc["text"]
            for doc in self.documents
           ]

           self.embeddings = self.model.encode(texts)

           np.save("embeddings.npy", self.embeddings)


           print("Embeddings saved.")

        dimension = self.embeddings.shape[1]

        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(self.embeddings, dtype=np.float32))

    def query(self, search_query, top_k=5):
        if self.index is None:
            raise ValueError("Vector index not built")

        query_embedding = self.model.encode([search_query])
        top_k = min(top_k, len(self.documents))
        distances, indices = self.index.search(
            np.array(query_embedding, dtype=np.float32),
            top_k
        )

        results = []

        for idx, distance in zip(indices[0], distances[0]):

            if idx < 0 or idx >= len(self.documents):
                 continue

            doc = self.documents[idx]
            similarity = 1 / (1 + float(distance))
            results.append({
                "doc_id": doc["doc_id"],
                "title": doc["title"],
                "text": doc["text"],
                "similarity": similarity
            })

        return results
