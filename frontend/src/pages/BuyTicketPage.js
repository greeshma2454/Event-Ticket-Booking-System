import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api/api";
import { useAuth } from "../auth/AuthContext";

export default function BuyTicketPage() {
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const events = await apiGet("/events");
        const found = events.find((e) => e.event_id === Number(event_id));
        setEvent(found || null);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [event_id]);

  async function handleBuy() {
    if (!event) return;
    setError("");
    setLoading(true);
    try {
      // 1) create booking
      const bookingRes = await apiPost("/bookings", {
        user_id: user.id,
        event_id: event.event_id,
        quantity: qty,
        booking_date: new Date().toISOString(),
        status: "confirmed",
      });

      const bookingId = bookingRes.booking_id;

      // 2) create payment
      await apiPost("/payments", {
        booking_id: bookingId,
        amount: qty * event.ticket_price,
        payment_method: "Card",
        paid_at: new Date().toISOString(),
        status: "paid",
      });

      alert("Ticket purchased!");
      navigate("/user/bookings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!event) return <p>Loading event...</p>;

  return (
    <div>
      <h2>Buy Ticket</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>{event.title}</h3>
      <p>Location: {event.location}</p>
      <p>Price per ticket: ₹{event.ticket_price}</p>

      <div style={{ marginTop: 12 }}>
        <label>
          Quantity:{" "}
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 1)}
          />
        </label>
      </div>

      <p style={{ marginTop: 8 }}>
        Total: ₹{Number(qty) * Number(event.ticket_price)}
      </p>

      <button onClick={handleBuy} disabled={loading}>
        {loading ? "Processing..." : "Confirm Purchase"}
      </button>
    </div>
  );
}

