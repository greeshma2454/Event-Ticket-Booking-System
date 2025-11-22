import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <header
          style={{
            padding: "12px 20px",
            background: "white",
            borderBottom: "1px solid #e5e7eb",
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          Event Ticket Booking – Admin
        </header>
        <main style={{ padding: "16px 20px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}




