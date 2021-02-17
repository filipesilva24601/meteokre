CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT UNIQUE,
    name TEXT UNIQUE,
    password TEXT,
    CONSTRAINT google_id_unique UNIQUE (google_id),
    CONSTRAINT name_unique UNIQUE (name)
);
CREATE TABLE IF NOT EXISTS file (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(id)
);