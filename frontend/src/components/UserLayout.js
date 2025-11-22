import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// ICONS (React Icons)
import { FiHome, FiList, FiLogOut, FiShoppingCart } from "react-icons/fi";

export default function UserLayout() {
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
          background: "#1e293b",
          height: "100vh",
          padding: "20px",
          color: "white"
        }}
      >
        <h2>User Portal</h2>

        <Link to="/user" style={{ color: "white", display: "flex", gap: 8 }}>
          <FiHome /> Home
        </Link>

        <Link
          to="/user/events"
          style={{ color: "white", display: "flex", gap: 8, marginTop: 10 }}
        >
          <FiList /> Events
        </Link>

        <Link
          to="/user/bookings"
          style={{ color: "white", display: "flex", gap: 8, marginTop: 10 }}
        >
          <FiShoppingCart /> My Bookings
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




