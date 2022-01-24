const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const app = express();

// Create the server
let server = http.createServer(app);

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

// Socket.io libraries
let io = socketIO(server);

// Status and time variables to control the video
let video = {
    status: 'pause',
    time: 0
};

io.on('connection', (client)=> {
    // Console logs fos clients on connect and disconnect
    console.log('Cliente conectado');
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    })

    // Check status message. It returns the status of the video (play/pause).
    client.on('checkStatus', (message, callback) => {
        callback({
            status: video.status
        });
    });

    // Set the status of the video and perform broadcast to refresh all clients.
    client.on('setStatus', (message) => {
        video.status = message.status;
        io.sockets.emit('broadcastStatus', message);
    });

    // Check time of player. It returns the time of the video.
    client.on('checkTime', (message, callback) => {
        callback({
            time: video.time
        });
    });

    // Set the time of the video player and perform broadcast to refresh all clients.
    client.on('setTime', (message) => {
        video.time = message.time;
        io.sockets.emit('broadcastTime', message);
    });

});

// Starts the server
server.listen(port, (err) => {
    if (err) throw new Error(err);
    console.log(`Server running and listening in port: ${ port }`);
});