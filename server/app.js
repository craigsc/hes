
/**
 * Module dependencies.
 */

var express = require('express')
var socket_io = require('socket.io');

var routes = require('./routes');

var server = require('./server');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


server.listen(4000);
console.log("Game server listening on port %d", server.address().port);

var io = socket_io.listen(app);
io.sockets.on('connection', function(socket) {
  socket.on('reply', function(data) {
    console.log('REPLY: %s', data);
  });
  setInterval(function() {
    socket.emit('data', 'woop ' + Math.random());
  }, 1000);
});
