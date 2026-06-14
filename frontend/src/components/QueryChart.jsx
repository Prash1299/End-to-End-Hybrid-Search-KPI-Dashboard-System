


// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid
// } from "recharts";

// const data = [
//   { day:"Mon", searches:120 },
//   { day:"Tue", searches:180 },
//   { day:"Wed", searches:130 },
//   { day:"Thu", searches:210 },
//   { day:"Fri", searches:175 },
//   { day:"Sat", searches:260 },
//   { day:"Sun", searches:190 }
// ];

// function QueryChart() {
//   return (
//     <div className="chart-card">

//       <h2>Request Volume Over Time</h2>

//       <ResponsiveContainer width="100%" height={350}>
//         <AreaChart data={data}>

//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis dataKey="day" />

//           <YAxis />

//           <Tooltip />

//           <Area
//             type="monotone"
//             dataKey="searches"
//             stroke="#2563eb"
//             fill="#93c5fd"
//           />

//         </AreaChart>
//       </ResponsiveContainer>

//     </div>
//   );
// }

// export default QueryChart;

import { useEffect, useState } from "react";
import { getRequestVolume } from "../services/api";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function QueryChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    const loadData = async () => {
      try {
        const response = await getRequestVolume();

        const formatted = response.map(item => ({
          day: item.hour,
          searches: item.count
        }));

        setData(formatted);

      } catch (error) {
        console.error("Request Volume Error:", error);
      }
    };

    loadData();

  }, []);

  return (
    <div className="chart-card">

      <h2>Request Volume Over Time</h2>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" 
          tick={{ fontSize: 15 }}
          />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="searches"
            stroke="#2563eb"
            fill="#93c5fd"
          />

        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}

export default QueryChart;