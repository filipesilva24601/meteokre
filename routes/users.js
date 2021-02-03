var express = require("express");
var router = express.Router();
var db = require("../database/db");

const bcrypt = require("bcrypt");

router.get('/authcheck', function (req, res, next) {
  if(req.session.userid){
    res.send({username: req.session.username});
  } else {
    res.status(403).send({ message: "Not authenticated."})
  }
});

router.post("/logout", function (req, res, next) {
  req.session.destroy();
  res.send({ message: "Logged out" });
});

router.post("/login", function (req, res, next) {
  db.get(
    "SELECT id, name, password from user where name=?",
    [req.body.username],
    (err, row) => {
      if (row) {
        if (bcrypt.compareSync(req.body.password, row.password)) {
          req.session.authenticated = true;
          req.session.username = row.name;
          req.session.userid = row.id;
          res.send({ message: "Logged in." });
        } else {
          res.status(401).send({ message: "Incorrect password." });
        }
      } else {
        res.status(401).send({ message: "User not found." });
      }
    }
  );
});

router.post("/register", function (req, res, next) {
  bcrypt.hash(req.body.password, 10).then((pass) => {
    db.run(
      "INSERT INTO user (name, password) VALUES (?, ?)",
      [req.body.username, pass],
      (err) => {
        if (err) {
          res.status(409).send({ message: "Username already exists." });
        } else {
          res.send({ message: "Registered successfully." });
        }
      }
    );
  });
});

module.exports = router;
