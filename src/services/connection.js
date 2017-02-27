var storage = require('node-persist');
var users = require('../models/model').users;
var matchedusers = require('../models/model').matchedusers;

var conversations = storage.create();
conversations.initSync({
  dir: './data/conversations'
});

Connection = function(socket) {

  /*
  Sets up a separate space for connected users to exchange signaling information
  */
  socket.on('acceptmeeting', function(userinfo) {
    Connection.acceptMeeting(userinfo, socket);
  });

  socket.on('session-description', function(data) {
    Connection.sessionDescription(data, socket);
  });

  socket.on('ice-candidate', function(data) {
    Connection.iceCandidate(data, socket);
  });
};

Connection.acceptMeeting = function(userinfo, socket) {
  var user = matchedusers.getItemSync(socket.id);
  user.id = socket.id;
  socket.to(userinfo.id).emit('useravailable', user);
};

Connection.sessionDescription = function(data, socket) {
  socket.to(data.id).emit('session-description', data);
};

Connection.iceCandidate = function(data, socket) {
  socket.to(data.id).emit('ice-candidate', data);
};

Connection.conversations = conversations;

module.exports = Connection;
