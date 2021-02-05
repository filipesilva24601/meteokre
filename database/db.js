var sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            google_id text UNIQUE,
            name text UNIQUE,
            password text, 
            CONSTRAINT google_id_unique UNIQUE (google_id),
            CONSTRAINT name_unique UNIQUE (name)
            )`, (err) => {
                return;
            });
  }
});

module.exports = db;
