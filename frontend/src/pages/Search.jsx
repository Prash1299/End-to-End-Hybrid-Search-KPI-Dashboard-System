import { useState } from "react";

import "../styles/search.css";

import axios from "axios";



function Search() {
  const submitFeedback = async (
    query,
    docId,
    relevance
  ) => {
    try {
      await axios.post(
        "http://localhost:8000/feedback",
        {
          query,
          doc_id: docId,
          relevance
        }
      );
  
      setFeedbackMessage(
        "Feedback submitted successfully"
      );
  
      setTimeout(() => {
        setFeedbackMessage("");
      }, 2000);
  
    } catch (error) {
      console.error(error);
    }
  };
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [latency, setLatency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alpha, setAlpha] = useState(0.5);
  const [topK, setTopK] = useState(5);
  const [feedbackMessage, setFeedbackMessage] =
  useState("");

  const handleSearch = async () => {
    try {
      setLoading(true);
  
      const response = await fetch(
        "http://localhost:8000/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query,
            top_k: topK,
            alpha
          })
        }
      );
  
      const data = await response.json();
  
      setResults(data.results);
      setLatency(data.latency_ms);
  
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const highlightText = (text, query) => {

    if (!query) return text;
  
    const regex = new RegExp(`(${query})`, "gi");
  
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={index}>{part}</mark>
        : part
    );
  };

  return (
    <div className="search-page">

<div className="search-hero">
  <div>
    <h1>AI Search Workspace</h1>
    <p>
      Hybrid Retrieval powered by BM25 + FAISS + Sentence Transformers
    </p>
  </div>

  <div className="hero-status">
    🟢 Search Engine Active
  </div>
</div>

      <div className="search-content">

      <div className="search-header">
        
        {feedbackMessage && (
  <div className="feedback-toast">
    {feedbackMessage}
  </div>
)}

        <div className="search-box">

  <input
    type="text"
    placeholder="Enter search query..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />

  {query && (
    <button
      className="clear-btn"
      onClick={() => setQuery("")}
    >
      ✕
    </button>
  )}

  <button
    className="search-btn"
    onClick={handleSearch}
  >
    Search
  </button>

</div>

        <div className="filters">

  <label className="filter-label">
    Alpha
  </label>

  <input
    type="range"
    min="0"
    max="1"
    step="0.1"
    value={alpha}
    onChange={(e) =>
      setAlpha(Number(e.target.value))
    }
  />

  <span className="filter-value">
    {alpha}
  </span>

</div>
       



<div>

<label>
Top K:
</label>

<select
  value={topK}
  onChange={(e) =>
    setTopK(Number(e.target.value))
  }
>

<option value={5}>5</option>

<option value={10}>10</option>

<option value={20}>20</option>

</select>

</div>



        {latency && (
          <p className="latency">
            Latency: {latency.toFixed(2)} ms
          </p>
        )}
      </div>

      {loading && <p>Searching...</p>}

      <div className="search-summary">

  <div className="summary-card">
    Results: {results.length}
  </div>

  <div className="summary-card">
    Latency: {latency?.toFixed(2)} ms
  </div>

  <div className="summary-card">
    Alpha: {alpha}
  </div>

</div>
</div>

      <div className="results-container">
        {results.map((result,index) => (
          <div key={result.doc_id} className="result-card">   

<div className="result-rank">
  #{index + 1}
</div>

            <h3>{result.title}</h3>

            <div className="retrieval-badge">
  Hybrid Retrieval
</div>

            <p className="doc-id">
              Doc ID: {result.doc_id}
            </p>

            <p className="result-text">
  {highlightText(result.text, query)}
</p>

<div className="scores">

<div className="score-bar">

  <label>
    Hybrid Score
  </label>

  <progress
    value={result.hybrid_score}
    max="1"
  />

  <span>
    {result.hybrid_score.toFixed(3)}
  </span>

</div>

<div className="score-bar">

  <label>
    BM25 Score
  </label>

  <progress
    value={result.bm25_score}
    max="1"
  />

  <span>
    {result.bm25_score.toFixed(3)}
  </span>

</div>

<div className="score-bar">

  <label>
    Vector Score
  </label>

  <progress
    value={result.vector_score}
    max="1"
  />

  <span>
    {result.vector_score.toFixed(3)}
  </span>

</div>

<div className="feedback-actions">

  <button
    className="relevant-btn"
    onClick={() =>
      submitFeedback(
        query,
        result.doc_id,
        "relevant"
      )
    }
  >
    👍 Relevant
  </button>

  <button
    className="not-relevant-btn"
    onClick={() =>
      submitFeedback(
        query,
        result.doc_id,
        "not_relevant"
      )
    }
  >
    👎 Not Relevant
  </button>

</div>

</div>

          </div>
        ))}
      </div>

      

    </div>

    
  );
}

export default Search;