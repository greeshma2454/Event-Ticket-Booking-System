import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./components/RequireAuth";

// Layouts
import Layout from "./components/Layout";          // Admin layout
import UserLayout from "./components/UserLayout";  // User layout
import OrganizerLayout from "./components/OrganizerLayout"; // NEW

// Admin pages
import LoginPage from "./pages/LoginPage";
import EventsPage from "./pages/EventsPage";
import UsersPage from "./pages/UsersPage";
import PaymentsPage from "./pages/PaymentsPage";
import BookingsPage from "./pages/BookingsPage";
import DashboardPage from "./pages/DashboardPage"; // Admin Analytics

// User pages
import UserHomePage from "./pages/UserHomePage";
import UserEventsPage from "./pages/UserEventsPage";
import BuyTicketPage from "./pages/BuyTicketPage";
import UserBookingsPage from "./pages/UserBookingsPage";
import UserPaymentsPage from "./pages/UserPaymentsPage";

// Organizer pages (NEW).//

import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";
import OrganizerEventsPage from "./pages/OrganizerEventsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ---------- PUBLIC LOGIN ---------- */}
          <Route path="/" element={<LoginPage />} />

          {/* ---------- USER PORTAL ROUTES ---------- */}
          <Route
            path="/user"
            element={
              <RequireAuth role="customer">
                <UserLayout />
              </RequireAuth>
            }
          >
            <Route index element={<UserHomePage />} />
            <Route path="events" element={<UserEventsPage />} />
            <Route path="buy/:event_id" element={<BuyTicketPage />} />
            <Route path="bookings" element={<UserBookingsPage />} />
            <Route path="payments" element={<UserPaymentsPage />} />
          </Route>

          {/* ---------- ORGANIZER PORTAL ROUTES ---------- */}
          <Route
            path="/organizer"
            element={
              <RequireAuth role="organizer">
                <OrganizerLayout />
              </RequireAuth>
            }
          >
            <Route index element={<OrganizerDashboardPage />} />
            <Route path="events" element={<OrganizerEventsPage />} />
          </Route>

          {/* ---------- ADMIN PORTAL ROUTES ---------- */}
          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;


