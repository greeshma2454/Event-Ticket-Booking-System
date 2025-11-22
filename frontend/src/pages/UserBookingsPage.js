import React, { useEffect, useState } from "react";
import { apiGet } from "../api/api";
import { useAuth } from "../auth/AuthContext";

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet("/bookings");
        const mine = data.filter((b) => b.user_id === user.id);
        setBookings(mine);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [user.id]);

  return (
    <div>
      <h2>My Bookings</h2>
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
            Booking #{b.booking_id} – Event #{b.event_id}
          </p>
          <p>
            Quantity: {b.quantity} | Status: {b.status} | Date: {b.booking_date}
          </p>
        </div>
      ))}
      {bookings.length === 0 && <p>No bookings yet.</p>}
    </div>
  );
}
 
