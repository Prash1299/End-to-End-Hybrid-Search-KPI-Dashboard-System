import React, { useState,useEffect } from "react";
import "../styles/debug.css";

import {
  getDebugLogs,
  getDebugStats,
  getDebugDistribution,
  getDebugTrend
} from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// const logs = [
//   {
//     timestamp: "2026-06-12 10:21",
//     severity: "ERROR",
//     component: "FAISS",
//     message: "Index file missing",
//   },
//   {
//     timestamp: "2026-06-12 10:24",
//     severity: "WARNING",
//     component: "Search",
//     message: "Low recall detected",
//   },
//   {
//     timestamp: "2026-06-12 10:29",
//     severity: "CRITICAL",
//     component: "API",
//     message: "Backend unavailable",
//   },
//   {
//     timestamp: "2026-06-12 10:35",
//     severity: "INFO",
//     component: "Evaluation",
//     message: "Experiment completed",
//   },
//   {
//     timestamp: "2026-06-12 11:10",
//     severity: "ERROR",
//     component: "Embedding",
//     message: "Model loading failed",
//   },
// ];

// const severityData = [
//   { name: "Info", value: 12 },
//   { name: "Warning", value: 8 },
//   { name: "Error", value: 5 },
//   { name: "Critical", value: 2 },
// ];

// const trendData = [
//   { day: "Mon", errors: 2 },
//   { day: "Tue", errors: 4 },
//   { day: "Wed", errors: 3 },
//   { day: "Thu", errors: 8 },
//   { day: "Fri", errors: 5 },
//   { day: "Sat", errors: 2 },
//   { day: "Sun", errors: 1 },
// ];
export default function Debug() {
const [logs, setLogs] = useState([]);

const [stats, setStats] = useState({
  total_logs: 0,
  errors: 0,
  warnings: 0,
  critical: 0
});

// const [timeRange, setTimeRange] =
//   useState("1h");
//   <select
//  value={timeRange}
//  onChange={(e) =>
//    setTimeRange(e.target.value)
//  }
// ></select>

const [severityData, setSeverityData] =
  useState([]);

const [trendData, setTrendData] =
  useState([]);


  useEffect(() => {

    const loadDebug = async () => {
  
      try {
  
        const [
          logsData,
          statsData,
          distributionData,
          trendData
        ] = await Promise.all([
          getDebugLogs(),
          getDebugStats(),
          getDebugDistribution(),
          getDebugTrend()
        ]);
  
        setLogs(logsData);
        setStats(statsData);
        setSeverityData(distributionData);
        setTrendData(trendData);
  
      } catch(error) {
  
        console.error(error);
  
      }
    };
  
    loadDebug();
  
    const interval =
      setInterval(loadDebug, 5000);
  
    return () =>
      clearInterval(interval);
  
  }, []);

const COLORS = [
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#7c3aed",
];


  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");

  const filteredLogs = logs.filter((log) => {
    const severityMatch =
      severityFilter === "ALL"
        ? true
        : log.severity === severityFilter;

    const searchMatch =
      log.message.toLowerCase().includes(searchText.toLowerCase()) ||
      log.source.toLowerCase().includes(searchText.toLowerCase());

    return severityMatch && searchMatch;
  });

  return (

    
    <div className="debug-page">
      

      <div className="debug-hero">

<div>

<h1>System Monitoring Center</h1>

<p>
Track failures,
warnings,
logs and runtime issues
</p>

</div>

<div className="incident-badge">

🟢 Healthy

</div>

</div>

      {/* KPI CARDS */}

      <div className="debug-kpis">
        <div className="debug-card">
          <h3>Total Logs</h3>
          <p>{stats.total_logs}</p>
        </div>

        <div className="debug-card">
          <h3>Errors</h3>
          <p>{stats.errors}</p>
        </div>

        <div className="debug-card">
          <h3>Warnings</h3>
          <p>{stats.warnings}</p>
        </div>

        <div className="debug-card">
          <h3>Critical</h3>
          <p>{stats.critical}</p>
        </div>
      </div>

      {/* FILTERS */}

      <div className="filter-card">
        <select>
          <option>Last Hour</option>
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="INFO">Info</option>
          <option value="WARNING">Warning</option>
          <option value="ERROR">Error</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <input
          type="text"
          placeholder="Search logs..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* CHARTS */}

      <div className="chart-grid">
        {/* PIE CHART */}

        <div className="chart-card">
          <h2>Error Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {severityData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}

        <div className="chart-card">
          <h2>Error Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
              dataKey="hour"
              tick={{ fontSize: 15 }}
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="errors"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LOG TABLE */}

      <div className="table-card">
        <h2>Structured Error Logs</h2>

        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Severity</th>
              <th>Component</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                {/* <td>{log.severity}</td> */}
                <td>
<span
 className={`badge badge-${log.severity.toLowerCase()}`}
>
 {log.severity}
</span>
</td>
                <td>{log.source}</td>
                <td>{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}