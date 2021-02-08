var express = require("express");
var router = express.Router();
var db = require("../database/db");

const bcrypt = require("bcrypt");
const { google } = require("googleapis");

router.get("/authcheck", function (req, res, next) {
  if (req.session.userid) {
    res.send({ username: req.session.username });
  } else {
    res.send({ message: "Not authenticated." });
  }
});

router.post("/logout", function (req, res, next) {
  req.session.destroy();
  res.send({ message: "Logged out" });
});

router.get("/login", function (req, res, next) {
  var OAuth2 = google.auth.OAuth2;
  var oauth2Client = new OAuth2();
  oauth2Client.setCredentials({ access_token: req.session.grant.response.access_token });
  var oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });
  oauth2.userinfo.get(function (err, userinfo) {
    if (err) {
      console.err(err);
      res.redirect('/login');
    } else {
      db.get("SELECT id, name from user where google_id=?", [userinfo.data.id], (err, row) => {
        if (row) {
          req.session.authenticated = true;
          req.session.username = row.name;
          req.session.userid = row.id;
          res.redirect('/pastebin');
        } else {
          db.run(
            "INSERT INTO user (name, google_id) VALUES (?, ?)",
            [userinfo.data.name, userinfo.data.id],
            (err) => {
              if (err) {
                console.error(err);
                res.redirect('/login');
              } else {
                req.session.authenticated = true;
                req.session.username = row.name;
                req.session.userid = row.id;
                res.redirect('/pastebin');
              }
            }
          );
        }
      });
    }
  });
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
          req.session.authenticated = true;
          req.session.username = req.body.username;
          req.session.userid = this.lastId;
          res.send({ message: "Registered successfully." });
        }
      }
    );
  });
});

module.exports = router;
