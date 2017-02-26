var expect = require('chai').expect;
var sinon = require('sinon');
var Matchmaker = require('../../src/services/matchmaker');
var storage = require('node-persist');

describe('matchmaker', function() {

  var socket, users;
  before(function(){
    users = Matchmaker.users;
  });

  beforeEach(function() {
    socket = {
      broadcast: {
        emit: function() {}
      },
      emit: function() {}
    };

    return users.clear();
  });

  describe('userConnected', function() {
    it('saves users information', function() {
      var userInfo = {
        name: 'Test user',
        sessionDescription: 'SDP string'
      };

      Matchmaker.userConnected('userid', userInfo, socket);

      var value = users.getItemSync('userid');

      expect(value).to.deep.equal(userInfo);
    });

    it('notifies user to wait for another user to connect', function() {
      sinon.spy(socket, 'emit')
      Matchmaker.userConnected('userid', {userInfo: 'info'}, socket);

      expect(socket.emit.calledWith('waitforusers', {})).to.be.ok;
    });

    it('notifies user is available on connection', function() {
      sinon.spy(socket, 'emit')
      users.setItemSync('userid2', {data: 'test'});

      Matchmaker.userConnected('userid', {userInfo: 'info'}, socket);

      expect(socket.emit.calledWith('useravailable', {id: 'userid2', data: 'test'})).to.be.ok;
      expect(users.values().length).to.equal(0);
      expect(users.keys().length).to.equal(0);
    });
  });

  describe('userDisconnected', function() {

    it('removes user information', function() {
      users.setItemSync('userid', {
        data: 'hello'
      });

      expect(users.getItemSync('userid')).to.be.ok;

      Matchmaker.userDisconnected('userid');

      expect(users.getItemSync('userid')).to.not.be.ok;
    });
  });
});
