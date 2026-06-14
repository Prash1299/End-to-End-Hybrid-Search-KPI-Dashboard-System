

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip
// } from "recharts";

// const data = [
//   { query:"Laptop", count:124 },
//   { query:"Monitor", count:95 },
//   { query:"Keyboard", count:82 },
//   { query:"Headphones", count:70 },
//   { query:"Mouse", count:60 }
// ];

// function TopQueries() {
//   return (
//     <div className="chart-card">

//       <h2>Top Queries</h2>

//       <ResponsiveContainer width="100%" height={350}>
//         <BarChart data={data}
//         margin={{
//           top:20,
//           right:20,
//           left:0,
//           bottom:40
//         }}
//         >

//           <XAxis dataKey="query"
//           angle={0}
//           interval={0}
//           />

//           <YAxis/>

//           <Tooltip/>

//           <Bar
//             dataKey="count"
//             fill="#3b82f6"
//             radius={[8,8,0,0]}
//           />

//         </BarChart>
//       </ResponsiveContainer>

//     </div>
//   );
// }

// export default TopQueries;



import { useState, useEffect } from "react";
import { getTopQueries } from "../services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

function TopQueries() {

  const [data, setData] = useState([]);

  useEffect(() => {

    const loadQueries = async () => {
      try {

        const response = await getTopQueries();

        setData(response);

      } catch (error) {
        console.error("Top Queries Error:", error);
      }
    };

    loadQueries();

  }, []);

  return (
    <div className="chart-card">

      <h2>Top Queries</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{
            top:20,
            right:20,
            left:0,
            bottom:40
          }}
        >

<XAxis
  dataKey="query"
  angle={-25}
  textAnchor="end"
  height={80}
/>

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[8,8,0,0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default TopQueries;