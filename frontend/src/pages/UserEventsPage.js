import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/api";

export default function UserEventsPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet("/events");
        setEvents(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  return (
    <div>
      <h2>Available Events</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {events.map((ev) => (
        <div
          key={ev.event_id}
          style={{
            border: "1px solid #e5e7eb",
            padding: 10,
            marginBottom: 8,
            borderRadius: 6,
          }}
        >
          <h3>{ev.title}</h3>
          <p>Category: {ev.category}</p>
          <p>Location: {ev.location}</p>
          <p>Price: ₹{ev.ticket_price}</p>
          <Link to={`/user/buy/${ev.event_id}`}>Buy Ticket</Link>
        </div>
      ))}
    </div>
  );
}

