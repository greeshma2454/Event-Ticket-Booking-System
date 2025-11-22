import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/api";

export default function UsersPage() {
  const emptyForm = {
    email: "",
    password_hash: "",
    first_name: "",
    last_name: "",
    role: "customer",
  };
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      const data = await apiGet("/users");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSave() {
    try {
      if (editingId) {
        await apiPut(`/users/${editingId}`, form);
      } else {
        await apiPost("/users", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await apiDelete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(u) {
    setEditingId(u.user_id);
    setForm({
      email: u.email,
      password_hash: "",
      first_name: u.first_name,
      last_name: u.last_name,
      role: u.role,
    });
  }

  return (
    <div>
      <h2>Users</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          marginBottom: 20,
          padding: 12,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        <h4>{editingId ? "Edit User" : "Add User"}</h4>
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Password (stored as hash)"
          value={form.password_hash}
          onChange={(e) =>
            setForm({ ...form, password_hash: e.target.value })
          }
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="First name"
          value={form.first_name}
          onChange={(e) =>
            setForm({ ...form, first_name: e.target.value })
          }
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Last name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          style={{ marginRight: 8 }}
        >
          <option value="customer">Customer</option>
          <option value="organizer">Organizer</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleSave}>{editingId ? "Save" : "Create"}</button>
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

      {users.map((u) => (
        <div
          key={u.user_id}
          style={{
            border: "1px solid #e5e7eb",
            padding: 10,
            marginBottom: 8,
            borderRadius: 6,
          }}
        >
          <strong>
            {u.first_name} {u.last_name}
          </strong>{" "}
          ({u.email}) – <em>{u.role}</em>
          <div style={{ marginTop: 6 }}>
            <button onClick={() => startEdit(u)} style={{ marginRight: 8 }}>
              Edit
            </button>
            <button onClick={() => handleDelete(u.user_id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

