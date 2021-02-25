var express = require("express");
var router = express.Router();

const { v4: uuidv4 } = require("uuid");

var Busboy = require("busboy");
var path = require("path");
var os = require("os");
var fs = require("fs");

var db = require("../database/db");

var restrict = require("../auth");

var {root} = require("../config");

router.get("/file/:fileid", function (req, res, next) {
  console.log(root, path.join(root, "files", req.params.fileid));
  res.sendFile(path.join(root, "files", req.params.fileid));
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
  res.sendFile(path.join(root, "meta", req.params.fileid));
});

router.post("/file", restrict, function (req, res, next) {
  var busboy = new Busboy({ headers: req.headers });
  let id = uuidv4();
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    if (fieldname == "meta") {
      var filePath = path.join(root, "meta", id);
      file.pipe(fs.createWriteStream(filePath));
    }
    if (fieldname == "file") {
      var filePath = path.join(root, "files", id);
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

router.delete("/file/:id", restrict, function (req, res, next) {
  db.get("SELECT user_id FROM file WHERE id=?", [req.params.id], (err, row) => {
    if (err){
      res.status(500).send({ message: err });
    } else {
      if (!row) {
        res.status(500).send({ message: "Couldn't find the file" });
      }
      if (row.user_id !== req.session.userid) {
        res.status(403).send({ message: "Can't deleter other user's files" });
      } else {
        db.run("DELETE FROM file WHERE id=?", [req.params.id], (err) => {
          if (err) {
            res.status(500).send({ message: err });
          } else {
            fs.rmSync(path.join(root, "files", req.params.id));
            fs.rmSync(path.join(root, "meta", req.params.id));
            res.send({ message: "Deleted file successfuly" })
          }
        })
      }
    }
  })
})

module.exports = router;
