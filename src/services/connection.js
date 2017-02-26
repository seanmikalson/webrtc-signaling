var storage = require('node-persist');
var users = require('./matchmaker').users;

var conversations = storage.create();
conversations.initSync({
  dir: './data/conversations'
});

Connection = function(socket) {

  /*
  Sets up a separate space for connected users to exchange signaling information
  */
  socket.on('acceptmeeting', function(userId) {
    Connection.acceptMeeting(userId, socket);
  });

  socket.on('session-description', function(data) {
    Connection.sessionDescription(data, socket);
  });

  socket.on('ice-candidate', function(data) {
    Connection.iceCandidate(data, socket);
  });
};

Connection.acceptMeeting = function(userId, socket) {
  var user = users.getItemSync(socket.id);
  user.id = socket.id;
  socket.to(userId).emit('useravailable', user);
};

Connection.sessionDescription = function(data, socket) {
  socket.to(data.id).emit('sessiondescription', data);
};

Connection.iceCandidate = function(data, socket) {
  socket.to(data.id).emit('icecandidate', data);
};

Connection.conversations = conversations;

module.exports = Connection;
