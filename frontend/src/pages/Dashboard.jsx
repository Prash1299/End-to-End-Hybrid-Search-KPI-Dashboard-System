import { useState, useEffect } from "react";
import {
  getMetrics,
  getRequestVolume,
  getTopQueries,
  getZeroResults,
} from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
 } from "recharts";

import "../styles/dashboard.css";
import "../styles/cards.css";
import MetricCard from "../components/MetricCard";
import QueryChart from "../components/QueryChart";
import TopQueries from "../components/TopQueries";
import LatencyChart from "../components/LatencyChart";

function Dashboard() {
  const [metrics, setMetrics] = useState({
    total_searches: 0,
    p50_latency_ms: 0,
    p95_latency_ms: 0,
    zero_results_queries: 0,
  });
  
  const [requestVolume, setRequestVolume] = useState([]);
  const [topQueries, setTopQueries] = useState([]);
  const [zeroResultQueries, setZeroResultQueries] = useState([]);
  // const successRate =
  // metrics.total_searches > 0
  //   ? (
  //       (metrics.total_searches -
  //         metrics.zero_results) /
  //       metrics.total_searches
  //     ) * 100
  //   : 0;


  const loadDashboard = async () => {
    try {

      const metricsData = await getMetrics();
      setMetrics(metricsData);

      const volumeData = await getRequestVolume();
      setRequestVolume(volumeData);

      const topData = await getTopQueries();
      setTopQueries(topData);

      const zeroData = await getZeroResults();
      setZeroResultQueries(zeroData);

      
    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  useEffect(() => {
    loadDashboard();
  
    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);
  
    return () => clearInterval(interval);
  
  }, []);

  return (
    
    

    <div className="dashboard-container">

<div className="hero-banner">
  <div>
    <h1>Hybrid Search Analytics</h1>
    <p>
      Live monitoring of search quality,
      latency and retrieval performance
    </p>
  </div>

  <div className="hero-status">
    🟢 {metrics.total_searches > 0
      ? "System Healthy"
      : "No Search Activity"}
  </div>
</div> 

      <div className="metrics-grid">

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div>
            <h4>Total Searches</h4>
            <h2>{metrics.total_searches}</h2>
            <span className="positive">↑ 14.2%</span>
            <span> vs last week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱</div>
          <div>
            <h4>P50 Latency</h4>
            <h2>{Math.round(metrics.p50_latency_ms)} ms</h2>
            <span className="positive">↓ 8.7%</span>
            <span> vs last week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏰</div>
          <div>
            <h4>P95 Latency</h4>
            <h2>{Math.round(metrics.p95_latency_ms)} ms</h2>
            <span className="positive">↓ 6.1%</span>
            <span> vs last week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">😕</div>
          <div>
            <h4>Zero Results</h4>
            <h2>{metrics.zero_result_queries}</h2>
            <span className="positive">↓ 2.4%</span>
            <span> vs last week</span>
          </div>
        </div>

        

{/* <div className="metric-icon">
📊
</div>

<div>

<h4>Search Activity</h4>

<h2>

{metrics.total_searches > 100
 ? "High"
 : metrics.total_searches > 20
 ? "Medium"
 : "Low"}

</h2>

</div> */}



      </div>


      <QueryChart data={requestVolume} />

      <div className="bottom-grid">
      <TopQueries data={topQueries} />
        <LatencyChart />
      </div>
{/* 
      <div className="zero-chart-card">

<h2>Search Success Rate</h2>

<PieChart width={250} height={250}>
   <Pie
      data={[
         {name:"Success", value:98},
         {name:"Failed", value:2}
      ]}
      innerRadius={70}
      outerRadius={100}
      dataKey="value"
   >
      <Cell fill="#2563eb"/>
      <Cell fill="#e5e7eb"/>
   </Pie>
</PieChart>

</div> */}


    </div>
  );
}

export default Dashboard;



// import React, { useEffect, useState } from "react";

// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar
// } from "recharts";

// import {
//   getMetrics,
//   getRequestVolume,
//   getZeroResults
// } from "../services/api";

// import "../styles/dashboard.css";

// const COLORS = [
//   "#2563eb",
//   "#60a5fa",
//   "#93c5fd",
//   "#1d4ed8",
//   "#3b82f6"
// ];

// export default function Dashboard() {

//   const [metrics, setMetrics] = useState({
//     total_searches: 0,
//     p50_latency_ms: 0,
//     p95_latency_ms: 0,
//     zero_result_queries: 0,
//     top_queries: []
//   });

//   const [requestVolume, setRequestVolume] = useState([]);

//   const [zeroResults, setZeroResults] = useState([]);

//   const fetchDashboardData = async () => {

//     try {

//       const metricsRes =
//         await getMetrics();

//       const volumeRes =
//         await getRequestVolume();

//       const zeroRes =
//         await getZeroResults();

//       setMetrics(metricsRes.data);

//       setRequestVolume(volumeRes.data);

//       setZeroResults(zeroRes.data);

//     } catch (error) {

//       console.error(error);

//     }
//   };

//   useEffect(() => {

//     fetchDashboardData();

//     const interval = setInterval(
//       fetchDashboardData,
//       3000
//     );

//     return () =>
//       clearInterval(interval);

//   }, []);

//   return (
//     <div className="dashboard-page">

//       <h1 className="dashboard-title">
//         KPI Dashboard
//       </h1>

//       {/* KPI CARDS */}

//       <div className="kpi-grid">

//         <div className="kpi-card">
//           <h3>Total Searches</h3>
//           <h2>{metrics.total_searches}</h2>
//         </div>

//         <div className="kpi-card">
//           <h3>P50 Latency</h3>
//           <h2>
//             {metrics.p50_latency_ms.toFixed(2)} ms
//           </h2>
//         </div>

//         <div className="kpi-card">
//           <h3>P95 Latency</h3>
//           <h2>
//             {metrics.p95_latency_ms.toFixed(2)} ms
//           </h2>
//         </div>

//         <div className="kpi-card">
//           <h3>Zero Results</h3>
//           <h2>
//             {metrics.zero_result_queries}
//           </h2>
//         </div>

//       </div>

//       {/* REQUEST VOLUME */}

//       <div className="dashboard-card">

//         <h2>
//           Request Volume Over Time
//         </h2>

//         <ResponsiveContainer
//           width="100%"
//           height={350}
//         >

//           <AreaChart data={requestVolume}>

//             <CartesianGrid strokeDasharray="3 3" />

//             <XAxis dataKey="hour" />

//             <YAxis />

//             <Tooltip />

//             <Area
//               type="monotone"
//               dataKey="count"
//               stroke="#2563eb"
//               fill="#93c5fd"
//             />

//           </AreaChart>

//         </ResponsiveContainer>

//       </div>

//       {/* TOP QUERIES */}

//       <div className="dashboard-card">

//         <h2>Top Queries</h2>

//         <ResponsiveContainer
//           width="100%"
//           height={350}
//         >

//           <BarChart
//             data={metrics.top_queries}
//           >

//             <CartesianGrid strokeDasharray="3 3" />

//             <XAxis dataKey="query" />

//             <YAxis />

//             <Tooltip />

//             <Bar
//               dataKey="count"
//               fill="#2563eb"
//             />

//           </BarChart>

//         </ResponsiveContainer>

//       </div>

//       {/* ZERO RESULT QUERIES */}

//       <div className="dashboard-card">

//         <h2>
//           Zero Result Queries
//         </h2>

//         <ResponsiveContainer
//           width="100%"
//           height={350}
//         >

//           <PieChart>

//             <Pie
//               data={zeroResults}
//               dataKey="count"
//               nameKey="query"
//               outerRadius={120}
//               label
//             >

//               {zeroResults.map(
//                 (_, index) => (
//                   <Cell
//                     key={index}
//                     fill={
//                       COLORS[
//                         index %
//                         COLORS.length
//                       ]
//                     }
//                   />
//                 )
//               )}

//             </Pie>

//             <Tooltip />

//           </PieChart>

//         </ResponsiveContainer>

//       </div>

//     </div>
//   );
// }