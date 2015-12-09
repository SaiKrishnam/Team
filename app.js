var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//mongoose connecting to database
var mongoose = require('mongoose');

//var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);



var routes = require('./routes/index');
var users = require('./routes/users');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
////app.use(function(req,res,next){
////  var handler = multer({
////      dest:'./uploads',
////      rename: function (fieldname, filename, req, res) {
////          var username = req.cookies.user;
////          return username + '001';
////      }
////  })
//
//  handler(req,res,next);
//});
//mongoose.connect('mongodb://localhost/test');
//app.use(session({
//  secret:'hello sai',
//  saveUninitialized: false, // don't create session until something stored
//  resave: false, //don't save session if unmodified
//  store: new MongoStore({
//    url: 'mongodb://localhost/test' })
//}));



app.use('/', routes);


/*
 1. every route that starts with /user, will have to go through this
    middleware.
 2. So every request will be checked if its cookie has the username,
    and it is authenticated or else they will be logged out immediately
 3.

 */

console.log(routes.userName+'------username takenout after setting cookie');

app.use('/users',users);



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
