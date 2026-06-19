import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import { FaTrophy } from "react-icons/fa";

import "../styles/Evaluation.css";

const experimentData = [
  {
    alpha: 0,
    ndcg: 0.72,
    recall: 0.68,
    precision: 0.61,
    mrr: 0.59,
  },
  {
    alpha: 0.3,
    ndcg: 0.81,
    recall: 0.76,
    precision: 0.72,
    mrr: 0.70,
  },
  {
    alpha: 0.6,
    ndcg: 0.89,
    recall: 0.84,
    precision: 0.80,
    mrr: 0.79,
  },
  {
    alpha: 0.8,
    ndcg: 0.93,
    recall: 0.89,
    precision: 0.87,
    mrr: 0.85,
  },
  {
    alpha: 1.0,
    ndcg: 0.87,
    recall: 0.82,
    precision: 0.79,
    mrr: 0.77,
  },
];

export default function Evaluation() {
  const bestRun = experimentData.reduce((a, b) =>
    a.ndcg > b.ndcg ? a : b
  );

  // return (
  //   <div className="evaluation-page">
  //     <h1 className="evaluation-title">Evaluation Dashboard</h1>

  //     {/* KPI Cards */}
  //     <div className="kpi-grid">
  //       <div className="kpi-card">
  //         <h3>Total Experiments</h3>
  //         <p>{experimentData.length}</p>
  //       </div>

  //       <div className="kpi-card">
  //         <h3>Best Alpha</h3>
  //         <p>{bestRun.alpha}</p>
  //       </div>

  //       <div className="kpi-card">
  //         <h3>Best nDCG@10</h3>
  //         <p>{bestRun.ndcg}</p>
  //       </div>
  //     </div>

  //     {/* Table */}
  //     <div className="table-card">
  //       <h2>Experiment Results</h2>

  //       <table>
  //         <thead>
  //           <tr>
  //             <th>Alpha</th>
  //             <th>nDCG@10</th>
  //             <th>Recall@10</th>
  //             <th>Precision@10</th>
  //             <th>MRR</th>
  //           </tr>
  //         </thead>

  //         <tbody>
  //           {experimentData.map((row, index) => (
  //             <tr key={index}>
  //               <td>{row.alpha}</td>
  //               <td>{row.ndcg}</td>
  //               <td>{row.recall}</td>
  //               <td>{row.precision}</td>
  //               <td>{row.mrr}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>

  //     {/* Graph */}
  //     <div className="chart-card">
  //       <h2>Alpha vs nDCG@10</h2>

  //       <ResponsiveContainer width="100%" height={500}>
  //         <AreaChart data={experimentData}>
  //           <CartesianGrid strokeDasharray="3 3" />

  //           <XAxis dataKey="alpha" />

  //           <YAxis
  //             domain={[0.6, 1]}
  //             label={{
  //               value: "nDCG@10",
  //               angle: -90,
  //               position: "insideLeft",
  //             }}
  //           />

  //           <Tooltip />

  //           <Area
  //             type="monotone"
  //             dataKey="ndcg"
  //             stroke="#2563eb"
  //             fill="#93c5fd"
  //             fillOpacity={0.5}
  //           />
  //         </AreaChart>
  //       </ResponsiveContainer>
  //     </div>
  //   </div>

  return (
    <div className="evaluation-page">
  
      {/* HERO */}
  
      <div className="hero-banner">
  
        <div>
          <h1>Retrieval Quality Analytics</h1>
  
          <p>
            Monitor ranking quality,
            alpha tuning and search effectiveness
          </p>
        </div>
  
        <div className="hero-badge">
          🏆 Best Run
          <span>{bestRun.alpha}</span>
        </div>
  
      </div>
  
      {/* KPI */}
  
      <div className="kpi-grid">
  
        <div className="kpi-card">
          <h3>Total Experiments</h3>
          <p>{experimentData.length}</p>
        </div>
  
        <div className="kpi-card winner-card">
          <FaTrophy size={30} />
  
          <h3>Best Alpha</h3>
  
          <p>{bestRun.alpha}</p>
        </div>
  
        <div className="kpi-card">
          <h3>Best nDCG@10</h3>
  
          <p>{bestRun.ndcg}</p>
        </div>
  
      </div>
  
      {/* TABLE */}
  
      <div className="table-card">
  
        <h2>Experiment Results</h2>
  
        <table>
  
          <thead>
            <tr>
              <th>Alpha</th>
              <th>nDCG@10</th>
              <th>Recall@10</th>
              <th>Precision@10</th>
              <th>MRR</th>
            </tr>
          </thead>
  
          <tbody>
  
            {experimentData.map((row,index)=>(
              <tr key={index}>
  
                <td>{row.alpha}</td>
  
                <td>
                  <span className="metric-pill green">
                    {row.ndcg}
                  </span>
                </td>
  
                <td>
                  <span className="metric-pill blue">
                    {row.recall}
                  </span>
                </td>
  
                <td>
                  <span className="metric-pill purple">
                    {row.precision}
                  </span>
                </td>
  
                <td>
                  <span className="metric-pill orange">
                    {row.mrr}
                  </span>
                </td>
  
              </tr>
            ))}
  
          </tbody>
  
        </table>
  
      </div>
  
      {/* CHART */}
  
      <div className="chart-card">
  
        <h2>Alpha vs nDCG@10</h2>
  
        <ResponsiveContainer width="100%" height={500}>
  
          <AreaChart data={experimentData}>
  
            <CartesianGrid strokeDasharray="3 3" />
  
            <XAxis dataKey="alpha" />
  
            <YAxis domain={[0.6,1]} />
  
            <Tooltip />
  
            <ReferenceLine
              y={0.90}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label="Target"
            />
  
            <Area
              type="monotone"
              dataKey="ndcg"
              stroke="#2563eb"
              fill="#93c5fd"
              fillOpacity={0.45}
            />
  
          </AreaChart>
  
        </ResponsiveContainer>
  
      </div>
  
    </div>
  );
}