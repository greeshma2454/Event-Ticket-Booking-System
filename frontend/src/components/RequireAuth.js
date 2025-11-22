import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

/**
 * Protect routes by requiring a login.
 * Supports 3 roles → admin, organizer, customer
 */
export default function RequireAuth({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();

  // Not logged in → go to login page
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If a specific role is required:
  if (role && user.role !== role) {

    // Redirect to correct portal based on their real role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "organizer") {
      return <Navigate to="/organizer" replace />;
    }

    if (user.role === "customer") {
      return <Navigate to="/user" replace />;
    }

    // Unknown role → send to login
    return <Navigate to="/" replace />;
  }

  // Authorized → allow access
  return children;
}






