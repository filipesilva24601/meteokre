var sqlite3 = require("sqlite3").verbose();
var fs = require("fs");
var path = require("path");
var {root} = require("../config");

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(path.join(root, DBSOURCE), (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    const schema = fs.readFileSync("database/schema.sql", "utf8");
    db.exec(schema, (err) => {
                return;
            });
  }
});

module.exports = db;
