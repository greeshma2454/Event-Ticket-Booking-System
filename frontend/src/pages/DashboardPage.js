import React, { useEffect, useState } from "react";
import { apiGet } from "../api/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const e = await apiGet("/events");
    const p = await apiGet("/payments");
    const u = await apiGet("/users");
    const b = await apiGet("/bookings");

    setEvents(e);
    setPayments(p);
    setUsers(u);
    setBookings(b);
  }

  // -------- ANALYTICS --------
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const barData = {
    labels: events.map((e) => e.title),
    datasets: [
      {
        label: "Ticket Price",
        data: events.map((e) => e.ticket_price),
        backgroundColor: "#2563eb",
      },
    ],
  };

  const pieData = {
    labels: ["Users", "Events", "Bookings", "Payments"],
    datasets: [
      {
        data: [users.length, events.length, bookings.length, payments.length],
        backgroundColor: ["#1d4ed8", "#16a34a", "#f59e0b", "#dc2626"],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

      {/* ------- TOP ANALYTICS CARDS ------- */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <Card title="Total Users" value={users.length} color="#2563eb" />
        <Card title="Total Events" value={events.length} color="#16a34a" />
        <Card title="Total Bookings" value={bookings.length} color="#f59e0b" />
        <Card title="Total Revenue" value={"$" + totalRevenue} color="#dc2626" />
      </div>

      {/* ------- CHARTS SECTION ------- */}
      <div style={{ display: "flex", gap: "30px" }}>
        
        {/* BAR CHART */}
        <div style={{ width: "55%", background: "#fff", padding: 20, borderRadius: 10 }}>
          <h3>Event Ticket Prices</h3>
          <Bar data={barData} />
        </div>

        {/* PIE CHART */}
        <div style={{ width: "35%", background: "#fff", padding: 20, borderRadius: 10 }}>
          <h3>System Overview</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}

// ---------- CARD COMPONENT ----------
function Card({ title, value, color }) {
  return (
    <div
      style={{
        flex: 1,
        background: color,
        padding: "20px",
        borderRadius: "12px",
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "20px",
      }}
    >
      <div style={{ fontSize: "18px", opacity: 0.9 }}>{title}</div>
      <div style={{ fontSize: "26px", marginTop: 6 }}>{value}</div>
    </div>
  );
}


