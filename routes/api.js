var express = require("express");
var router = express.Router();

const { v4: uuidv4 } = require("uuid");

var Busboy = require("busboy");
var path = require("path");
var os = require("os");
var fs = require("fs");

var restrict = require("../auth");

var basepath = "./test";
var root = path.parse(__dirname).dir;

router.get("/file/:fileid", function (req, res, next) {
  res.sendFile(path.join(basepath, "files", req.params.fileid), { root: root });
});

router.get("/meta/:fileid", function (req, res, next) {
  res.sendFile(path.join(basepath, "files", req.params.fileid + ".meta"), {
    root: root,
  });
});

router.post("/file/:fileid", restrict, function (req, res, next) {
  var busboy = new Busboy({ headers: req.headers });
  let id = req.params.fileid;
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    var filePath = path.join(basepath, "files", id);
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

router.post("/meta", restrict, function (req, res, next) {
  var busboy = new Busboy({ headers: req.headers });
  let id = uuidv4();
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    var filePath = path.join(basepath, "files", id + ".meta");
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
