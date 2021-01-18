var express = require("express");
var router = express.Router();

const { v4: uuidv4 } = require("uuid");

var Busboy = require("busboy");
var path = require("path");
var os = require("os");
var fs = require("fs");

var basepath = "./test";
var root = path.parse(__dirname).dir;

/* GET home page. */
router.get("/file", function (req, res, next) {
  res.render("api", { target: "files" });
});

router.get("/file/:fileid", function (req, res, next) {
  res.sendFile(path.join(basepath, "files", req.params.fileid), { root: root });
});

router.post("/file", function (req, res, next) {
  var busboy = new Busboy({ headers: req.headers });
  let id = uuidv4();
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    var filePath = path.join(basepath, "files", path.basename(id));
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", function () {
    res.send({ fileid: id });
  });
  busboy.on("error", function (err) {
    res.status(500).send({ error: err });
  });
  return req.pipe(busboy);
});

module.exports = router;
