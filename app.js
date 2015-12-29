var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var utils = require('./utils');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var csrf = require('csurf');
var mongoose = require('mongoose');
var session = require('client-sessions');
var logfmt = require("logfmt");
var middleware = require('./middleware');

/**
 * METHOD-OVERRIDE is used to allow PUT requests for updating of documents in database (e.g. see noteedit.jade)
 * CLIENT-SESSIONS: Upon registration or login (in auth.js), a function in utils.js creates the session cookie
 * LOGFMT: I don't know how to use this yet
 * MIDDLEWARE (simpleAuth): If registration or login, then req object will have session and user objects attached
 *          It seems that simpleAuth checks for this and updates these objects upon every request, based on
 *          whatever is currently in the database?
 **/

var routes = require('./routes/index');

mongoose.connect('mongodb://localhost/svcc');
//I don't remember why I put these database objects here--I would like to get rid of them
var models = require('./models/activity.js');
var notes = require('./models/notes.js');
var comments = require('./models/comments.js');
var app = express();

// view engine setup
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/activities'), path.join(__dirname, 'views/badges'), path.join(__dirname, 'views/userdata')]);
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //default express app has this as false?

/**
 * function: methodOverride
 * arguments:
 * 
 *      req:    an object; We are looking to see if "_method" key has been attached to the body (coming from a form input)
 *      
 * failures:
 * 
 *      CHECK   The module method-override must take the returned method (e.g. put or delete) and attach it to the route
 *              If there is a misspelled method from the form input, I don't know what happens.
 **/

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));
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
//Currently, this won't be reached, because there is a 404 route in the index file without a "next"
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler--this is default of the NODE_ENV variable, but it is also currently set in the .env file
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
