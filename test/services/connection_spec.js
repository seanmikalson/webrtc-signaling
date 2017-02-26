var expect = require('chai').expect;
var sinon = require('sinon');
var Matchmaker = require('../../src/services/matchmaker');
var Connection = require('../../src/services/connection');
var storage = require('node-persist');

describe('ConnectionService', function() {
  var socket;
  beforeEach(function() {
    var mockSocket = function() {
      this.broadcast = {
        emit: function() {}
      }
    };
    mockSocket.prototype.emit = function() {};
    mockSocket.prototype.to = function() {};

    socket = new mockSocket();
  });

  describe('acceptMeeting', function() {
    it('sends user available to other user', function() {
      sinon.stub(socket, 'emit', function() {
        console.log('emitting');
      });
      sinon.stub(socket, 'to', function() {
        return socket;
      });

      Matchmaker.users.setItemSync('userId2', {data: 'hello'})
      socket.id = 'userId2';

      Connection.acceptMeeting('userId', socket);

      expect(socket.to.calledWith('userId')).to.be.ok;
      expect(socket.emit.calledWith('useravailable', {id:'userId2', data: 'hello'})).to.be.ok;
    });
  });

  describe('session-description', function() {
    it('sends sdp to userid in message', function() {
      sinon.stub(socket, 'emit', function() {
        console.log('emitting');
      });
      sinon.stub(socket, 'to', function() {
        return socket;
      });

      var sessionDescriptionData = {
        id: 'user',
        sessionDescription: 'sdp'
      }

      Connection.sessionDescription(sessionDescriptionData, socket);

      expect(socket.to.calledWith('user')).to.be.ok;
      expect(socket.emit.calledWith('sessiondescription', {id:'user', sessionDescription: 'sdp'})).to.be.ok;
    });
  });

  describe('icecandidate', function() {
    it('sends ice to userid in message', function() {
      sinon.stub(socket, 'emit', function() {
        console.log('emitting');
      });
      sinon.stub(socket, 'to', function() {
        return socket;
      });

      var iceData = {
        id: 'user',
        iceData: 'ice'
      }

      Connection.iceCandidate(iceData, socket);

      expect(socket.to.calledWith('user')).to.be.ok;
      expect(socket.emit.calledWith('icecandidate', {id:'user', iceData: 'ice'})).to.be.ok;
    });
  });
});
