import "../styles/navbar.css";

function Navbar() {
  return (
    <div className="navbar">

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      

      <div className="navbar-actions">
        <span>🔔</span>
        <span>⚙️</span>
        <span>👤</span>
      </div>

    </div>
  );
}

export default Navbar;