// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer
// } from "recharts";

// const data = [
//   { day: "Mon", latency: 45 },
//   { day: "Tue", latency: 52 },
//   { day: "Wed", latency: 48 },
//   { day: "Thu", latency: 61 },
//   { day: "Fri", latency: 58 },
//   { day: "Sat", latency: 54 },
//   { day: "Sun", latency: 50 }
// ];

// function LatencyChart() {
//   return (
//     <div className="latency-card">
//       <h2>Latency Trend</h2>

//       <ResponsiveContainer
//         width="100%"
//         height={300}
//       >
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis dataKey="day" />

//           <YAxis />

//           <Tooltip />

//           <Line
//             type="monotone"
//             dataKey="latency"
//             stroke="#60a5fa"
//             strokeWidth={3}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default LatencyChart;

import { useState, useEffect } from "react";
import { getLatencyTrend } from "../services/api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

// const data = [
//   { day:"Mon", p50:28, p95:45 },
//   { day:"Tue", p50:34, p95:52 },
//   { day:"Wed", p50:30, p95:48 },
//   { day:"Thu", p50:40, p95:62 },
//   { day:"Fri", p50:36, p95:58 },
//   { day:"Sat", p50:32, p95:54 },
//   { day:"Sun", p50:28, p95:50 }
// ];

function LatencyChart() {
  const [data, setData] = useState([]);
  useEffect(() => {

    const loadLatency = async () => {
  
      try {
  
        const response = await getLatencyTrend();
  
        setData(response);
  
      } catch (error) {
  
        console.error(
          "Latency Trend Error:",
          error
        );
  
      }
    };
  
    loadLatency();
  
    const interval = setInterval(
      loadLatency,
      5000
    );
  
    return () => clearInterval(interval);
  
  }, []);

  return (
    <div className="chart-card">

      <h2>Latency Trend</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <XAxis dataKey="hour"
          tick={{ fontSize: 15 }}
          />

          <YAxis/>

          <Tooltip/>

          <Line
  type="monotone"
  dataKey="p50"
  stroke="#2563eb"
  strokeWidth={3}
  name="P50"
/>

<Line
  type="monotone"
  dataKey="p95"
  stroke="#8b5cf6"
  strokeWidth={3}
  name="P95"
/>

        </LineChart>
      </ResponsiveContainer>
      <Legend />

    </div>
  );
}

export default LatencyChart;