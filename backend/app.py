from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

DB_PATH = r"C:\Users\kgree\OneDrive\Desktop\event_app\backend\eventapp.db"

# ---------------- DB CONNECTION ----------------
def get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False, timeout=10)
    conn.row_factory = sqlite3.Row
    return conn


app = Flask(__name__)
CORS(app)


# ------------------------------------------------
#                    LOGIN
# ------------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        "SELECT user_id, email, first_name, last_name, role FROM users "
        "WHERE email=? AND password_hash=?",
        (email, password),
    )
    row = cur.fetchone()
    conn.close()

    if not row:
        return jsonify({"ok": False, "message": "Invalid email or password"}), 401

    return jsonify({
        "ok": True,
        "user": {
            "id": row["user_id"],
            "email": row["email"],
            "role": row["role"],
        }
    })


# ------------------------------------------------
#                EVENTS CRUD
# ------------------------------------------------
@app.route("/events", methods=["GET", "POST"])
def events():
    conn = get_conn()
    cur = conn.cursor()

    if request.method == "GET":
        cur.execute("SELECT * FROM events ORDER BY event_id DESC")
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return jsonify(rows)

    # POST - create event
    data = request.get_json() or {}
    cur.execute("""
        INSERT INTO events (organizer_id, title, description, category, 
                            location, start_time, end_time, total_tickets, ticket_price)
        VALUES (1, ?, '', ?, ?, '', '', 100, ?)
    """, (
        data.get("title"),
        data.get("category"),
        data.get("location"),
        float(data.get("ticket_price", 0))
    ))

    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return jsonify({"event_id": new_id}), 201


@app.route("/events/<int:event_id>", methods=["PUT", "DELETE"])
def event_detail(event_id):
    conn = get_conn()
    cur = conn.cursor()

    if request.method == "PUT":
        data = request.get_json() or {}
        cur.execute("""
            UPDATE events
            SET title=?, category=?, location=?, ticket_price=?
            WHERE event_id=?
        """, (
            data.get("title"),
            data.get("category"),
            data.get("location"),
            float(data.get("ticket_price", 0)),
            event_id
        ))
        conn.commit()
        conn.close()
        return jsonify({"ok": True})

    # DELETE
    cur.execute("DELETE FROM events WHERE event_id=?", (event_id,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


# ------------------------------------------------
#                EVENTS SUMMARY
# ------------------------------------------------
@app.route("/events/summary")
def summary():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT title, ticket_price FROM events")
    rows = cur.fetchall()
    conn.close()

    return jsonify({
        "labels": [r["title"] for r in rows],
        "values": [r["ticket_price"] for r in rows],
    })


# ------------------------------------------------
#                 USERS CRUD
# ------------------------------------------------
@app.route("/users", methods=["GET", "POST"])
def users_collection():
    conn = get_conn()
    cur = conn.cursor()

    if request.method == "GET":
        cur.execute("SELECT * FROM users ORDER BY user_id DESC")
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return jsonify(rows)

    data = request.get_json() or {}
    cur.execute("""
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data.get("email"),
        data.get("password_hash"),
        data.get("first_name"),
        data.get("last_name"),
        data.get("role", "customer")
    ))

    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return jsonify({"user_id": new_id}), 201


@app.route("/users/<int:user_id>", methods=["GET", "PUT", "DELETE"])
def users_detail(user_id):
    conn = get_conn()
    cur = conn.cursor()

    if request.method == "GET":
        cur.execute("SELECT * FROM users WHERE user_id=?", (user_id,))
        row = cur.fetchone()
        conn.close()
        return jsonify(dict(row)) if row else ({"message": "User not found"}, 404)

    if request.method == "PUT":
        data = request.get_json() or {}
        cur.execute("""
            UPDATE users
            SET email=?, password_hash=?, first_name=?, last_name=?, role=?
            WHERE user_id=?
        """, (
            data.get("email"),
            data.get("password_hash"),
            data.get("first_name"),
            data.get("last_name"),
            data.get("role"),
            user_id
        ))
        conn.commit()
        conn.close()
        return jsonify({"ok": True})

    # DELETE
    cur.execute("DELETE FROM users WHERE user_id=?", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


# ------------------------------------------------
#              BOOKINGS CRUD
# ------------------------------------------------
@app.route("/bookings", methods=["GET", "POST"])
def bookings_collection():
    conn = get_conn()
    cur = conn.cursor()

    if request.method == "GET":
        cur.execute("SELECT * FROM bookings ORDER BY booking_id DESC")
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return jsonify(rows)

    data = request.get_json() or {}
    cur.execute("""
        INSERT INTO bookings (user_id, event_id, quantity, booking_date, status)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data.get("user_id"),
        data.get("event_id"),
        int(data.get("quantity", 1)),
        data.get("booking_date", ""),
        data.get("status", "confirmed"),
    ))

    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return jsonify({"booking_id": new_id}), 201


@app.route("/bookings/<int:booking_id>", methods=["GET", "PUT", "DELETE"])
def bookings_detail(booking_id):
    conn = get_conn()
    cur = conn.cursor()

    if request.method == "GET":
        cur.execute("SELECT * FROM bookings WHERE booking_id=?", (booking_id,))
        row = cur.fetchone()
        conn.close()
        return jsonify(dict(row)) if row else ({"message": "Booking not found"}, 404)

    if request.method == "PUT":
        data = request.get_json() or {}
        cur.execute("""
            UPDATE bookings
            SET user_id=?, event_id=?, quantity=?, booking_date=?, status=?
            WHERE booking_id=?
        """, (
            data.get("user_id"),
            data.get("event_id"),
            int(data.get("quantity", 1)),
            data.get("booking_date"),
            data.get("status"),
            booking_id
        ))
        conn.commit()
        conn.close()
        return jsonify({"ok": True})

    cur.execute("DELETE FROM bookings WHERE booking_id=?", (booking_id,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


# ------------------------------------------------
#              PAYMENTS CRUD
# ------------------------------------------------
@app.route("/payments", methods=["GET", "POST"])
def payments_collection():
    conn = get_conn()
    cur = conn.cursor()

    if request.method == "GET":
        cur.execute("SELECT * FROM payments ORDER BY payment_id DESC")
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return jsonify(rows)

    data = request.get_json() or {}
    cur.execute("""
        INSERT INTO payments (booking_id, amount, payment_method, paid_at, status)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data.get("booking_id"),
        float(data.get("amount", 0)),
        data.get("payment_method", "Card"),
        data.get("paid_at", ""),
        data.get("status", "paid"),
    ))

    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return jsonify({"payment_id": new_id}), 201


@app.route("/payments/<int:payment_id>", methods=["GET", "PUT", "DELETE"])
def payments_detail(payment_id):
    conn = get_conn()
    cur = conn.cursor()

    if request.method == "GET":
        cur.execute("SELECT * FROM payments WHERE payment_id=?", (payment_id,))
        row = cur.fetchone()
        conn.close()
        return jsonify(dict(row)) if row else ({"message": "Payment not found"}, 404)

    if request.method == "PUT":
        data = request.get_json() or {}
        cur.execute("""
            UPDATE payments
            SET booking_id=?, amount=?, payment_method=?, paid_at=?, status=?
            WHERE payment_id=?
        """, (
            data.get("booking_id"),
            float(data.get("amount", 0)),
            data.get("payment_method"),
            data.get("paid_at"),
            data.get("status"),
            payment_id
        ))
        conn.commit()
        conn.close()
        return jsonify({"ok": True})

    cur.execute("DELETE FROM payments WHERE payment_id=?", (payment_id,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


# ------------------------------------------------
#                   RUN APP
# ------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
