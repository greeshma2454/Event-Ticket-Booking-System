import React, { useEffect, useState } from "react";
import { apiGet } from "../api/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await apiGet("/events");
      setEvents(data);

      // Convert event data → chart data
      const chartData = data.map(ev => ({
        name: ev.title,
        tickets: ev.total_tickets || 0,
        price: ev.ticket_price || 0
      }));

      setSales(chartData);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Organizer Dashboard</h1>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        Overview of your events and ticket sales
      </p>

      {/* KPI CARDS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={cardStyle}>
          <h3>Total Events</h3>
          <p style={cardNumber}>{events.length}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Tickets</h3>
          <p style={cardNumber}>
            {events.reduce((sum, e) => sum + (e.total_tickets || 0), 0)}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Avg Ticket Price</h3>
          <p style={cardNumber}>
            ₹{(
              events.reduce((sum, e) => sum + (e.ticket_price || 0), 0) /
              (events.length || 1)
            ).toFixed(2)}
          </p>
        </div>
      </div>

      {/* SALES CHART */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          height: "350px"
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Ticket Sales Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="tickets" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const cardStyle = {
  flex: 1,
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const cardNumber = {
  fontSize: "30px",
  fontWeight: "bold",
  marginTop: "10px",
};
 
