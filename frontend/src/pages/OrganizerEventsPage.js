import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/api";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    ticket_price: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Load events
  const loadEvents = async () => {
    const data = await apiGet("/events");
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Create event
  const createEvent = async () => {
    await apiPost("/events", form);
    setForm({ title: "", category: "", location: "", ticket_price: "" });
    loadEvents();
  };

  // Edit start
  const startEdit = (ev) => {
    setEditingId(ev.event_id);
    setForm({
      title: ev.title,
      category: ev.category,
      location: ev.location,
      ticket_price: ev.ticket_price,
    });
  };

  // Save edit
  const saveEdit = async () => {
    await apiPut(`/events/${editingId}`, form);
    setEditingId(null);
    setForm({ title: "", category: "", location: "", ticket_price: "" });
    loadEvents();
  };

  // Delete
  const deleteEvent = async (id) => {
    await apiDelete(`/events/${id}`);
    loadEvents();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Your Events</h2>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <input
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
      <input
        placeholder="Ticket Price"
        type="number"
        value={form.ticket_price}
        onChange={(e) => setForm({ ...form, ticket_price: e.target.value })}
      />

      {editingId ? (
        <button onClick={saveEdit}>Save</button>
      ) : (
        <button onClick={createEvent}>Create</button>
      )}

      <hr />

      <h3>Your Events</h3>

      {events.map((ev) => (
        <div
          key={ev.event_id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <h3>{ev.title}</h3>
          <p>{ev.category}</p>
          <p>{ev.location}</p>
          <p>Price: ${ev.ticket_price}</p>

          <button onClick={() => startEdit(ev)} style={{ marginRight: 10 }}>
            Edit
          </button>

          <button
            onClick={() => deleteEvent(ev.event_id)}
            style={{ background: "red", color: "white" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
