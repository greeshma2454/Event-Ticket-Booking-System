import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function UserHomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Welcome, {user?.email}</h2>
      <p style={{ marginBottom: 16 }}>
        Browse events, buy tickets, and see your bookings & payments.
      </p>

      <ul>
        <li>
          <Link to="/user/events">Browse Events</Link>
        </li>
        <li>
          <Link to="/user/bookings">My Bookings</Link>
        </li>
        <li>
          <Link to="/user/payments">My Payments</Link>
        </li>
      </ul>
    </div>
  );
}
 
