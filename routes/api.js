var express = require("express");
var router = express.Router();

var Busboy = require("busboy");
var path = require("path");
var os = require("os");
var fs = require("fs");

/* GET home page. */
router.get("/image", function (req, res, next) {
  res.render("api", { target: "Images" });
});

router.post("/image", function (req, res, next) {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    console.log(fieldname, file, filename, encoding, mimetype);
    var filePath = path.join("/home/fs/test", path.basename(filename));
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", function () {
    res.send("got the file");
  });
  return req.pipe(busboy);
});

module.exports = router;
