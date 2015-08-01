var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var utils = require('./utils');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var mongoose = require('mongoose');
var session = require('client-sessions');
var logfmt = require("logfmt");
var middleware = require('./middleware');


var routes = require('./routes/index');

mongoose.connect('mongodb://localhost/svcc');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //default express app has this as false?
app.use(session({
    cookieName: 'session', //JH This "key name" is added to the req object (client-sessions documentation)
    secret: 'keyboard cat',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));
app.use(csrf());
app.use(middleware.simpleAuth);

app.use(express.static(path.join(__dirname, 'public')));
app.use(logfmt.requestLogger());

app.use('/', routes);

var port = Number(process.env.PORT || 5000);

app.listen(port, function () {
    console.log("Listening on " + port);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
