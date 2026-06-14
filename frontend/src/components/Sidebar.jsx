import { Link } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2>Hybrid Search</h2>

      <Link to="/">Dashboard</Link>

      <Link to="/search">Search</Link>

      

      <Link to="/evaluation">Evaluation</Link>

      <Link to="/debug">Debug</Link>

      
      
    </div>
  );
}

export default Sidebar;