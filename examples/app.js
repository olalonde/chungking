var express = require('express'),
  controllers = require('./controllers');

var app = express();

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(app.router);
  app.use(express.errorHandler());
});

app.get('/error', function(req, res, next) {
  var ctl = new controllers.Home(req, res, next);
  ctl.action('error');
});

app.get('/', function(req, res, next) {
  var ctl = new controllers.Home(req, res, next);
  ctl.action('index');
});

app.get('/help', function(req, res, next) {
  var ctl = new controllers.Home(req, res, next);
  ctl.action('help');
});

app.get('/users', function(req, res, next) {
  var ctl = new controllers.Users(req, res, next);
  ctl.action('index');
}, function(req, res, next) {
  console.log('testing this.next() in index action');
});

app.get('/users/new', function(req, res, next) {
  var ctl = new controllers.Users(req, res, next);
  ctl.action('new');
});

app.listen(3050);
