import React, { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function AdminDashboardPage() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ev, us, bk, pay] = await Promise.all([
          apiGet("/events"),
          apiGet("/users"),
          apiGet("/bookings"),
          apiGet("/payments"),
        ]);

        setEvents(ev || []);
        setUsers(us || []);
        setBookings(bk || []);
        setPayments(pay || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ---- KPIs ----
  const totalEvents = events.length;
  const totalUsers = users.length;
  const totalBookings = bookings.length;
  const totalRevenue = payments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  // ---- Chart data: bookings per event ----
  const bookingCountByEventId = {};
  bookings.forEach((b) => {
    const eid = b.event_id;
    bookingCountByEventId[eid] = (bookingCountByEventId[eid] || 0) + 1;
  });

  const chartData = events.map((ev) => ({
    label: ev.title,
    value: bookingCountByEventId[ev.event_id] || 0,
  }));

  const maxValue =
    chartData.reduce((max, d) => (d.value > max ? d.value : max), 0) || 1;

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Dashboard</h2>
        <p>Loading analytics…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Admin Dashboard</h2>
      <p style={{ marginBottom: 24, color: "#6b7280" }}>
        Overview of events, users, bookings and payments in the system.
      </p>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <KpiCard label="Total Events" value={totalEvents} />
        <KpiCard label="Total Users" value={totalUsers} />
        <KpiCard label="Total Bookings" value={totalBookings} />
        <KpiCard
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
        />
      </div>

      {/* CHART + RECENT TABLES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        {/* Simple bar chart */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: 8 }}>Bookings per Event</h3>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>
            Number of bookings for each event.
          </p>

          {chartData.length === 0 ? (
            <p style={{ fontSize: 13, color: "#6b7280" }}>
              No bookings yet. Once users start booking tickets, the chart will
              show here.
            </p>
          ) : (
            <div style={{ marginTop: 8 }}>
              {chartData.map((d) => (
                <div key={d.label} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: 12,
                      marginBottom: 4,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{d.label}</span>
                    <span>{d.value}</span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      borderRadius: 999,
                      background: "#e5e7eb",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(d.value / maxValue) * 100}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg, #2563eb, #4f46e5)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest bookings list */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Recent Bookings</h3>
          {bookings.length === 0 ? (
            <p style={{ fontSize: 13, color: "#6b7280" }}>
              No bookings found.
            </p>
          ) : (
            <div
              style={{
                maxHeight: 260,
                overflowY: "auto",
                fontSize: 13,
              }}
            >
              {bookings
                .slice()
                .reverse()
                .slice(0, 8)
                .map((b) => (
                  <div
                    key={b.booking_id}
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <div>
                      <strong>Booking #{b.booking_id}</strong>
                    </div>
                    <div style={{ color: "#6b7280" }}>
                      User ID: {b.user_id} · Event ID: {b.event_id}
                    </div>
                    <div style={{ color: "#9ca3af" }}>
                      Qty: {b.quantity} · Status: {b.status}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          color: "#9ca3af",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
