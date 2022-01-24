"use strict";

// Socket.io
var socket = io(); // Check and set the status of the video when starts

socket.emit('checkStatus', null, function (resp) {
  setStatus(resp.status);
}); // Check and set the time of the video when starts

socket.emit('checkTime', null, function (resp) {
  setTime(resp.time);
}); // Sets the videoplayer status by the broadcast websocket. 
// It will update every client status.

socket.on('broadcastStatus', function (message) {
  setStatus(message.status);
}); // Sets the videoplayer time by the broadcast websocket. 
// It will update every client time.

socket.on('broadcastTime', function (message) {
  setTime(message.time);
}); // Get the html video element

var myVideo = document.getElementById("myVideo"); // Play the video

function playVideo() {
  myVideo.play();
} // Pause the video


function pauseVideo() {
  myVideo.pause();
} // Set the status of the videplayer (play/pause)


function setStatus(status) {
  if (status == 'play') {
    playVideo();
  } else if (status == 'pause') {
    pauseVideo();
  }
} // Set the cirrent time in the video


function setTime(time) {
  myVideo.currentTime = time;
} // If the video is played in the videoplayer, sends the status to the server.


myVideo.onplay = function () {
  socket.emit('setStatus', {
    status: 'play'
  });
}; // If the video is paused in the videoplayer, sends the status to the server.


myVideo.onpause = function () {
  socket.emit('setStatus', {
    status: 'pause'
  });
}; // When DOM is loaded


window.onload = function () {
  // If the user change the progress bar time of the video
  // it will update all the clients aswell
  document.getElementsByClassName("vjs-progress-control vjs-control")[0].onclick = function () {
    socket.emit('setTime', {
      time: myVideo.currentTime
    });
  };

  document.getElementsByClassName("vjs-progress-holder vjs-slider vjs-slider-horizontal")[0].onclick = function () {
    socket.emit('setTime', {
      time: myVideo.currentTime
    });
  };
};