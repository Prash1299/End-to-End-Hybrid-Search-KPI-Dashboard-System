Decision 1: BM25 + Vector Hybrid Retrieval

Alternatives Considered:- 
 -BM25 only
 -Vector search only

Decision
 -Use hybrid retrieval.

Rationale
 -BM25 provides strong lexical matching while vector search captures semantic similarity.

Outcome
 -Improved ranking quality compared to either approach alone.




Decision 2: SentenceTransformer all-MiniLM-L6-v2

Alternatives Considered:- 
 -all-mpnet-base-v2
 -BGE models

Decision
 -Use all-MiniLM-L6-v2.

Rationale
 -Provides good semantic performance with lower memory and CPU requirements.

Outcome
 -Fast inference and acceptable retrieval quality.




Decision 3: FAISS IndexFlatL2

Alternatives Considered:- 
 -ChromaDB
 -Pinecone
 -HNSW

Decision
 -Use FAISS.

Rationale
 -Simple local deployment and no external dependency.

Outcome
 -Fast semantic retrieval on local machine.




Decision 4: SQLite for Logging

Alternatives Considered
 -PostgreSQL
 -MongoDB

Decision
 -Use SQLite.

Rationale
 -Assignment scale did not require a dedicated database server.

Outcome
 -Simple deployment and persistence.




Decision 5: React Dashboard

Alternatives Considered
 -Vue
 -Plain HTML

Decision
 -Use React.

Rationale
 -Component-based architecture and strong ecosystem.

Outcome
 -Rapid dashboard development and API integration.




Decision 6: Startup Validation

Problem - Embedding model mismatch could corrupt retrieval quality.

Decision
 -Validate embedding metadata during startup.

Outcome
 -System fails safely instead of returning invalid results.