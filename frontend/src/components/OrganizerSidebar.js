import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiCalendar, FiLogOut } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext";

export default function OrganizerSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Organizer Panel</h2>

      <nav className="sidebar-nav">
        <NavLink to="/organizer" className="nav-item">
          <FiHome className="icon" /> Dashboard
        </NavLink>

        <NavLink to="/organizer/events" className="nav-item">
          <FiCalendar className="icon" /> My Events
        </NavLink>

        <button onClick={handleLogout} className="nav-item logout-btn">
          <FiLogOut className="icon" /> Logout
        </button>
      </nav>
    </div>
  );
}
