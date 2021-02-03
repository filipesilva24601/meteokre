module.exports = function (req, res, next) {
  if (req.session.userid !== undefined) {
    next();
  } else {
    err = new Error("Not authorized.");
    err.status = 401;
    next(err);
  }
};
