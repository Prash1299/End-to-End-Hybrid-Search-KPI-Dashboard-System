import axios from "axios";

const API_BASE = "http://localhost:8000";

export const getMetrics = async () => {
  const response = await axios.get(`${API_BASE}/metrics`);
  return response.data;
};

export const getRequestVolume = async () => {
  const response = await axios.get(`${API_BASE}/request-volume`);
  return response.data;
};

export const getTopQueries = async () => {
  const response = await axios.get(`${API_BASE}/top-queries`);
  return response.data;
};

export const getZeroResults = async () => {
  const response = await axios.get(`${API_BASE}/zero-results`);
  return response.data;
};

export const getLatencyTrend = async () => {
    const response = await axios.get(
      `${API_BASE}/latency-trend`
    );
    return response.data;
  };

  export const getDebugLogs = async () => {
    const res = await axios.get(
      "http://localhost:8000/logs"
    );
    return res.data;
  };
  
  export const getDebugStats = async () => {
    const res = await axios.get(
      "http://localhost:8000/stats"
    );
    return res.data;
  };
  
  export const getDebugDistribution =
    async () => {
      const res = await axios.get(
        "http://localhost:8000/distribution"
      );
      return res.data;
  };
  
  export const getDebugTrend =
    async () => {
      const res = await axios.get(
        "http://localhost:8000/trend"
      );
      return res.data;
  };