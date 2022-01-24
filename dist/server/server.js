"use strict";

var express = require('express');

var socketIO = require('socket.io');

var http = require('http');

var path = require('path');

var app = express(); // Create the server

var server = http.createServer(app);
var publicPath = path.resolve(__dirname, '../public');
var port = process.env.PORT || 3000;
app.use(express.static(publicPath)); // Socket.io libraries

var io = socketIO(server); // Status and time variables to control the video

var video = {
  status: 'pause',
  time: 0
};
io.on('connection', function (client) {
  // Console logs fos clients on connect and disconnect
  console.log('Cliente conectado');
  client.on('disconnect', function () {
    console.log('Cliente desconectado');
  }); // Check status message. It returns the status of the video (play/pause).

  client.on('checkStatus', function (message, callback) {
    callback({
      status: video.status
    });
  }); // Set the status of the video and perform broadcast to refresh all clients.

  client.on('setStatus', function (message) {
    video.status = message.status;
    io.sockets.emit('broadcastStatus', message);
  }); // Check time of player. It returns the time of the video.

  client.on('checkTime', function (message, callback) {
    callback({
      time: video.time
    });
  }); // Set the time of the video player and perform broadcast to refresh all clients.

  client.on('setTime', function (message) {
    video.time = message.time;
    io.sockets.emit('broadcastTime', message);
  });
}); // Starts the server

server.listen(port, function (err) {
  if (err) throw new Error(err);
  console.log("Server running and listening in port: ".concat(port));
});