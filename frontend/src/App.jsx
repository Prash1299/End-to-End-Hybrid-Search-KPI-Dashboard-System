import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import API_URL from "./api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alpha, setAlpha] = useState(0.6);
  const [logs, setLogs] = useState([]);

  const [metrics, setMetrics] = useState(null);

  const [severity, setSeverity] =
  useState("ALL");

  <select
 value={severity}
 onChange={(e) =>
   setSeverity(e.target.value)
 }
>
 <option>ALL</option>
 <option>INFO</option>
 <option>WARNING</option>
 <option>ERROR</option>
</select>

const filteredLogs =
logs.filter(log =>
  severity === "ALL"
  || log.severity === severity
);

  const [requestVolume,
    setRequestVolume] =
    useState([]);
  
  const [zeroResults, setZeroResults] =
  useState([]);

  useEffect(() => {
    fetchMetrics();
    fetchZeroResults();
    fetchRequestVolume();
    fetchLogs();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/metrics`     //metrics
      );

      setMetrics(response.data);
    } catch (error) {
      console.error("Metrics fetch failed", error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post(
         `${API_URL}/search`,     //search
        {
          query,
          top_k: 5,
          alpha,
        }
      );

      setResults(response.data.results);

      fetchMetrics();

    } catch (error) {
      console.error(error);
      alert("Search failed");
    }

    setLoading(false);
  };
  
  const sendFeedback = async (
    docId,
    relevance
  ) => {
  
    try {
  
      await axios.post(
        `${API_URL}/feedback`,      //feedback
        {
          query,
          doc_id: docId,
          relevance
        }
      );
  
      alert("Feedback saved");
  
    } catch (error) {
  
      console.error(error);
  
      alert("Feedback failed");
    }
  };

  const fetchRequestVolume =
  async () => {

    try {

      const response =
        await axios.get(
          `${API_URL}/request-volume`
        );

      setRequestVolume(
        response.data
      );

    } catch(error) {

      console.error(
        "Request volume failed",
        error
      );
    }
  };

  const fetchZeroResults = async () => {

    try {
  
      const response =
        await axios.get(
          `${API_URL}/zero-results`
        );
  
      setZeroResults(response.data);
  
    } catch (error) {
  
      console.error(
        "Zero results fetch failed",
        error
      );
  
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/logs`
      );
  
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  
  
  return (
    <div className="container">

      <h1>Hybrid Search Dashboard</h1>

      {metrics && (
        <>
          <div className="metrics-grid">

            <div className="metric-card">
              <h3>Total Searches</h3>
              <p>{metrics.total_searches}</p>
            </div>

            <div className="metric-card">
              <h3>Avg Latency</h3>
              <p>{metrics.average_latency_ms} ms</p>
            </div>

            <div className="metric-card">
              <h3>P50 Latency</h3>
              <p>{metrics.p50_latency_ms} ms</p>
            </div>

            <div className="metric-card">
              <h3>P95 Latency</h3>
              <p>{metrics.p95_latency_ms} ms</p>
            </div>

            <div className="metric-card">
              <h3>Zero Results</h3>
              <p>{metrics.zero_result_queries}</p>
            </div>

          </div>

          <div className="top-queries">
            <h2>Top Queries</h2>

            {metrics.top_queries.map((item, index) => (
              <div className="query-row" key={index}>
                <span>{item.query}</span>
                <span>{item.count}</span>
              </div>
            ))}
          </div>

          <div className="chart-container">
              <h2>Query Analytics</h2>
              <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.top_queries}>
              <XAxis dataKey="query" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
              </BarChart>
              </ResponsiveContainer>
          </div>

          <div className="chart-container">

              <h2>Request Volume Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
              <LineChart data={requestVolume}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count"/>
              </LineChart>
              </ResponsiveContainer>
          </div>

          <div className="chart-container">
  <h2>nDCG Trend Across Experiments</h2>

  <ResponsiveContainer
    width="100%"
    height={300}>
    <LineChart data={[
      { alpha: 0.0, ndcg: 0.94 },
      { alpha: 0.3, ndcg: 0.92 },
      { alpha: 0.6, ndcg: 0.93 },
      { alpha: 0.8, ndcg: 0.92 },
      { alpha: 1.0, ndcg: 0.91 }
    ]}>
      <XAxis dataKey="alpha" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="ndcg"
      />
    </LineChart>
  </ResponsiveContainer>
</div>


        </>
      )
  }

 



<div className="evaluation-table">
  <h2>Retrieval Evaluation</h2>

  <table>
    <thead>
      <tr>
        <th>Alpha</th>
        <th>Precision</th>
        <th>Recall@10</th>
        <th>MRR@10</th>
        <th>NDCG@10</th>
        <th>Latency</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>0.0</td>
        <td>0.89</td>
        <td>0.17</td>
        <td>0.91</td>
        <td>0.94</td>
        <td>23.88 ms</td>
      </tr>

      <tr>
        <td>0.3</td>
        <td>0.89</td>
        <td>0.17</td>
        <td>0.86</td>
        <td>0.92</td>
        <td>22.93 ms</td>
      </tr>

      <tr>
        <td>0.6</td>
        <td>0.89</td>
        <td>0.17</td>
        <td>0.93</td>
        <td>0.93</td>
        <td>18.86 ms</td>
      </tr>

      <tr>
        <td>0.8</td>
        <td>0.88</td>
        <td>0.17</td>
        <td>0.92</td>
        <td>0.92</td>
        <td>18.55 ms</td>
      </tr>

      <tr>
        <td>1.0</td>
        <td>0.87</td>
        <td>0.16</td>
        <td>0.91</td>
        <td>0.91</td>
        <td>18.33 ms</td>
      </tr>
    </tbody>
  </table>
</div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="slider-box">
        <label>
          Alpha (BM25 weight): {alpha}
        </label>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={alpha}
          onChange={(e) => setAlpha(Number(e.target.value))}
        />
      </div>

 

      {loading && <p>Searching...</p>}

      <div className="results">
        {results.map((item) => (
          <div key={item.doc_id} className="card">

          <h2>{item.title}</h2>

          <p className="preview-text">
            {item.text}
          </p>

          <p>
            <strong>Doc ID:</strong> {item.doc_id}
          </p>

            <p className="score bm25">
              BM25 Score: {item.bm25_score.toFixed(3)}
            </p>

            <p className="score Vector">
              Vector Score: {item.vector_score.toFixed(3)}
            </p>

            <p className="score Hybrid">
              Hybrid Score: {item.hybrid_score.toFixed(3)}
            </p>


            <div className="feedback-buttons">

              <button
                onClick={() =>
                   sendFeedback(item.doc_id, "Relevant")
                }
              >
               👍 Relevant
              </button>

              <button
                onClick={() =>
                    sendFeedback(item.doc_id, "Non-relevant")
                }
              >
               👎 Not Relevant
              </button>

            </div>

          </div>
        ))}
      </div>

      



    </div>

    
  );
}

export default App;
