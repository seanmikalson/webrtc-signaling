var expect = require('chai').expect;
var sinon = require('sinon');
var Connection = require('../../src/services/connection');
var matchedusers = require('../../src/models/model').matchedusers;

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

      matchedusers.setItemSync('userId2', {data: 'hello'})
      socket.id = 'userId2';

      Connection.acceptMeeting({id: 'userId'}, socket);

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
      expect(socket.emit.calledWith('session-description', {id:'user', sessionDescription: 'sdp'})).to.be.ok;
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
      expect(socket.emit.calledWith('ice-candidate', {id:'user', iceData: 'ice'})).to.be.ok;
    });
  });
});
