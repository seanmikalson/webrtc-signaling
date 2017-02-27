var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var MatchmakerService = require('./services/matchmaker');
var ConnectionService = require('./services/connection');

server.listen(3000);

app.get('/health', function (req, res) {
  res.send('Ready to go!');
});

io.on('connection', function(socket){
  MatchmakerService(socket);
  ConnectionService(socket);
});

io.on('connection', function (socket) {
  socket.on('session-description', function(session) {
    socket.broadcast.emit('session-description', session);
  });

  socket.on('ice-candidate', function(candidate) {
    socket.broadcast.emit('ice-candidate', candidate);
  })
});
