import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// ICONS
import { FiHome, FiCalendar, FiLogOut } from "react-icons/fi";

export default function OrganizerLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "220px",
          background: "#0f172a",
          height: "100vh",
          padding: "20px",
          color: "white"
        }}
      >
        <h2>Organizer</h2>

        <Link to="/organizer" style={{ color: "white", display: "flex", gap: 8 }}>
          <FiHome /> Dashboard
        </Link>

        <Link
          to="/organizer/events"
          style={{ color: "white", display: "flex", gap: 8, marginTop: 10 }}
        >
          <FiCalendar /> My Events
        </Link>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            background: "transparent",
            border: "none",
            color: "white",
            display: "flex",
            gap: 8,
            cursor: "pointer"
          }}
        >
          <FiLogOut /> Logout
        </button>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
 

