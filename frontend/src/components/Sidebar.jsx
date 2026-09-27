import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        🥛 <span>MilkMate</span>
      </div>


      <nav className="sidebar-nav">

        <NavLink
          to="/"
          className="nav-item"
        >
          🏠
          <span>Dashboard</span>
        </NavLink>


        <NavLink
          to="/customers"
          className="nav-item"
        >
          👥
          <span>Customers</span>
        </NavLink>


        <NavLink
          to="/deliveries"
          className="nav-item"
        >
          🚚
          <span>Deliveries</span>
        </NavLink>


        <NavLink
          to="/billing"
          className="nav-item"
        >
          💰
          <span>Billing</span>
        </NavLink>


        <NavLink
          to="/reports"
          className="nav-item"
        >
          📊
          <span>Reports</span>
        </NavLink>


        <NavLink
          to="/settings"
          className="nav-item"
        >
          ⚙️
          <span>Settings</span>
        </NavLink>

      </nav>


      <div className="sidebar-bottom">

        <button className="nav-item logout-button">
          🚪
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;