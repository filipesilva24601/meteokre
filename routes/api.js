var express = require("express");
var router = express.Router();

const { v4: uuidv4 } = require("uuid");

var Busboy = require("busboy");
var path = require("path");
var os = require("os");
var fs = require("fs");

var db = require("../database/db");

var restrict = require("../auth");

var basepath = "./test";
var root = path.parse(__dirname).dir;

router.get("/file/:fileid", function (req, res, next) {
  res.sendFile(path.join(basepath, "files", req.params.fileid), { root: root });
});

router.get("/files", restrict, function (req, res, next) {
  db.all("SELECT id FROM file WHERE user_id=?", [req.session.userid], (err, rows) => {
    if (!err) {
      console.log(rows);
      res.send(rows);
    }
  });
});

router.get("/meta/:fileid", function (req, res, next) {
  res.sendFile(path.join(basepath, "meta", req.params.fileid), {
    root: root,
  });
});

router.post("/file", restrict, function (req, res, next) {
  var busboy = new Busboy({ headers: req.headers });
  let id = uuidv4();
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    if (fieldname == "meta") {
      var filePath = path.join(basepath, "meta", id);
      file.pipe(fs.createWriteStream(filePath));
    }
    if (fieldname == "file") {
      var filePath = path.join(basepath, "files", id);
      file.pipe(fs.createWriteStream(filePath));
    }
  });
  busboy.on("finish", function () {
    db.run(
      "INSERT INTO file (id, user_id) values (?, ?)",
      [id, req.session.userid],
      (err) => {
        if (!err) {
          res.send({ fileid: id });
        }
      }
    );
  });
  busboy.on("error", function (err) {
    res.status(500).send({ error: err });
  });
  return req.pipe(busboy);
});

module.exports = router;
