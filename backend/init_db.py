import sqlite3

conn = sqlite3.connect("eventapp.db")
c = conn.cursor()

# USERS
c.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password_hash TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT
)
""")

# EVENTS
c.execute("""
CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizer_id INTEGER,
    title TEXT,
    description TEXT,
    category TEXT,
    location TEXT,
    start_time TEXT,
    end_time TEXT,
    total_tickets INTEGER,
    ticket_price REAL
)
""")

# BOOKINGS
c.execute("""
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_id INTEGER,
    quantity INTEGER,
    booking_date TEXT,
    status TEXT
)
""")

# PAYMENTS
c.execute("""
CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER,
    amount REAL,
    payment_method TEXT,
    paid_at TEXT,
    status TEXT
)
""")

# TICKETS
c.execute("""
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER,
    seat_number TEXT,
    qr_code TEXT,
    issued_at TEXT
)
""")

# --- INSERT SAMPLE DATA ---

# 10 USERS
for i in range(10):
    c.execute("""
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES (?, ?, ?, ?, ?)
    """, (f"user{i}@mail.com", "hash123", "User", f"{i}", "customer"))

# 10 EVENTS
for i in range(10):
    c.execute("""
        INSERT INTO events (organizer_id, title, description, category, location, 
                            start_time, end_time, total_tickets, ticket_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        1, 
        f"Event {i}", 
        "Sample description", 
        "Concert",
        "Memphis",
        "2025-06-01 10:00",
        "2025-06-01 12:00",
        100 + i,
        20 + i
    ))

# 10 BOOKINGS (user_id 1–10 booking event_id 1–10)
for i in range(10):
    c.execute("""
        INSERT INTO bookings (user_id, event_id, quantity, booking_date, status)
        VALUES (?, ?, ?, ?, ?)
    """, (i + 1, i + 1, (i + 1), "2025-06-01", "confirmed"))

# 10 PAYMENTS (1 per booking)
for i in range(10):
    c.execute("""
        INSERT INTO payments (booking_id, amount, payment_method, paid_at, status)
        VALUES (?, ?, ?, ?, ?)
    """, (i + 1, 20 + i, "card", "2025-06-01", "paid"))

# 10 TICKETS (1 per booking)
for i in range(10):
    c.execute("""
        INSERT INTO tickets (booking_id, seat_number, qr_code, issued_at)
        VALUES (?, ?, ?, ?)
    """, (i + 1, f"A{i+1}", f"QR{i+1}", "2025-06-01"))

conn.commit()
conn.close()

print("Database created successfully with EXACTLY 10 rows per table!")
