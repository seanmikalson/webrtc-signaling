var users = require('../models/model').users;
var matchedusers = require('../models/model').matchedusers;

var Matchmaker = function(socket) {
  socket.on('userconnected', function(userInfo) {
    Matchmaker.userConnected(socket.id, userInfo, socket);
  });

  socket.on('disconnect', function() {
    Matchmaker.userDisconnected(socket.id);
  });
};

Matchmaker.userConnected = function(id, userInfo, socket) {
  var allUsers = users.values();
  if(allUsers.length) {
    var firstUser = allUsers.pop();
    firstUser.id = users.keys().pop();
    socket.emit('useravailable', firstUser);
    users.removeItemSync(users.keys().pop());
    matchedusers.setItemSync(firstUser.id, firstUser);
    matchedusers.setItemSync(socket.id, userInfo);
  } else {
    users.setItemSync(id, userInfo);
    socket.emit('waitforusers', {});
  }
};

Matchmaker.userDisconnected = function(id) {
  users.removeItemSync(id);
};

Matchmaker.users = users;

module.exports = Matchmaker;
