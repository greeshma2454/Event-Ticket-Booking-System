import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/api";

export default function EventsPage() {
  const emptyForm = { title: "", category: "", location: "", ticket_price: "" };
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadEvents() {
    try {
      const data = await apiGet("/events");
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleCreate() {
    try {
      await apiPost("/events", form);
      setForm(emptyForm);
      setEditingId(null);
      loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate() {
    try {
      await apiPut(`/events/${editingId}`, form);
      setForm(emptyForm);
      setEditingId(null);
      loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this event?")) return;
    try {
      await apiDelete(`/events/${id}`);
      loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(ev) {
    setEditingId(ev.event_id);
    setForm({
      title: ev.title,
      category: ev.category,
      location: ev.location,
      ticket_price: ev.ticket_price,
    });
  }

  return (
    <div>
      <h2>Events</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form */}
      <div
        style={{
          marginBottom: 20,
          padding: 12,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        <h4 style={{ marginBottom: 8 }}>
          {editingId ? "Edit Event" : "Add New Event"}
        </h4>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Ticket Price"
          type="number"
          value={form.ticket_price}
          onChange={(e) =>
            setForm({ ...form, ticket_price: e.target.value })
          }
          style={{ marginRight: 8, width: 100 }}
        />
        {editingId ? (
          <button onClick={handleUpdate}>Save</button>
        ) : (
          <button onClick={handleCreate}>Create</button>
        )}
        {editingId && (
          <button
            style={{ marginLeft: 6 }}
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* List */}
      <div>
        {events.map((ev) => (
          <div
            key={ev.event_id}
            style={{
              border: "1px solid #e5e7eb",
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <h3>{ev.title}</h3>
            <p>Category: {ev.category}</p>
            <p>Location: {ev.location}</p>
            <p>Price: ₹{ev.ticket_price}</p>
            <button onClick={() => startEdit(ev)} style={{ marginRight: 8 }}>
              Edit
            </button>
            <button onClick={() => handleDelete(ev.event_id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}




