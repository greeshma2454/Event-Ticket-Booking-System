import React, { useEffect, useState } from "react";
import { apiGet } from "../api/api";
import { useAuth } from "../auth/AuthContext";

export default function UserPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const allPayments = await apiGet("/payments");
        const myBookings = await apiGet("/bookings");
        const myBookingIds = new Set(
          myBookings.filter((b) => b.user_id === user.id).map((b) => b.booking_id)
        );
        const mine = allPayments.filter((p) =>
          myBookingIds.has(p.booking_id)
        );
        setPayments(mine);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [user.id]);

  return (
    <div>
      <h2>My Payments</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {payments.map((p) => (
        <div
          key={p.payment_id}
          style={{
            border: "1px solid #e5e7eb",
            padding: 10,
            marginBottom: 8,
            borderRadius: 6,
          }}
        >
          <p>
            Payment #{p.payment_id} – Booking #{p.booking_id}
          </p>
          <p>
            Amount: ₹{p.amount} | Method: {p.payment_method} | Status: {p.status}
          </p>
          <p>Paid at: {p.paid_at}</p>
        </div>
      ))}
      {payments.length === 0 && <p>No payments yet.</p>}
    </div>
  );
}

