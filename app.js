var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const { v4: uuidv4 } = require('uuid');
var grant = require('grant').express();

var fileStoreOptions = {retries: 2, ttl: 3600 * 12};

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

app.use(session({
  genid: (req) => {return uuidv4();},
  // change secret when deploying
  secret: '37917a9b-ee9e-4b46-bd25-80d0d1cab213',
  resave: false,
  saveUninitialized: false,
  store: new FileStore(fileStoreOptions)
}))

app.use(grant(require("./grant_config.json")));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use("/", express.static(path.join(__dirname, "client/dist/client")));
app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname, "client/dist/client/index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
