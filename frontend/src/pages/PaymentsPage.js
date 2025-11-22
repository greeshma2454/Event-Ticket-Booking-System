import React, { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet("/payments");
        setPayments(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  return (
    <div>
      <h2>Payments</h2>
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
    </div>
  );
}

