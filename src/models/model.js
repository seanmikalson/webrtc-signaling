var storage = require('node-persist');

var users = storage.create();
users.initSync({
  dir: './data/users'
});

var matchedusers = storage.create();
matchedusers.initSync({
  dir: './data/matched'
});

module.exports = {
  users: users,
  matchedusers: matchedusers
}
