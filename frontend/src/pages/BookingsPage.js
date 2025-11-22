import React, { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet("/bookings");
        setBookings(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  return (
    <div>
      <h2>Bookings</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {bookings.map((b) => (
        <div
          key={b.booking_id}
          style={{
            border: "1px solid #e5e7eb",
            padding: 10,
            marginBottom: 8,
            borderRadius: 6,
          }}
        >
          <p>
            Booking #{b.booking_id} – User #{b.user_id} – Event #{b.event_id}
          </p>
          <p>
            Quantity: {b.quantity} | Status: {b.status} | Date: {b.booking_date}
          </p>
        </div>
      ))}
    </div>
  );
}

