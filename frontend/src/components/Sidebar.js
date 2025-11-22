import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const linkStyle = {
    display: "block",
    padding: "8px 12px",
    marginBottom: 4,
    borderRadius: 8,
    fontSize: 14,
    textDecoration: "none",
    color: "#e5e7eb",
  };

  const activeStyle = {
    background: "rgba(59,130,246,0.2)",
    color: "#ffffff",
  };

  return (
    <div
      style={{
        width: 220,
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: 16,
        boxSizing: "border-box",
      }}
    > 
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Admin Panel</div>
        {user && (
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
            {user.email} ({user.role})
          </div>
        )}
      </div>

      <nav>
        <NavLink
          to="/admin/dashboard"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/admin/events"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          🎫 Events
        </NavLink>

        <NavLink
          to="/admin/users"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          👤 Users
        </NavLink>

        <NavLink
          to="/admin/bookings"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📝 Bookings
        </NavLink>

        <NavLink
          to="/admin/payments"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          💳 Payments
        </NavLink>
      </nav>

      <div style={{ marginTop: 24, borderTop: "1px solid #1f2937", paddingTop: 12 }}>
        <NavLink
          to="/user"
          style={linkStyle}
        >
          🌐 Open User Portal
        </NavLink>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 8,
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
