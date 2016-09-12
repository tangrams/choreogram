var fs = require('fs');
var path = require('path');
var https = require('https');
var http = require('http');

var express = require('express');
var app = express();

var channels = {};
var users = {};

var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};
var HTTPS_PORT = 8080;

var server = https.createServer(options, app);
// var server = http.createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.channel = 'public';          // default channel

    // On join
    socket.on('join', function (event) {
        // Create user 
        if (!users[socket.id]) {
            users[socket.id] = event;   // store user data
        }

        // Remember channel
        socket.channel = event.channel;
        // Add user to room
        socket.join(socket.channel);
        // Create channel if there is not
        if (!channels[socket.channel]) {
            console.log("New channel", socket.channel);
            // Default initial position
            channels[socket.channel] = { channel: socket.channel, position: { lat:40.70531887544228, lng: -74.00976419448853}, zoom: 15, n_users: 0 };
        }
        channels[socket.channel].n_users += 1.;

        // Return ID
        socket.emit('wellcome', socket.id);
        // send actual position of channel
        socket.emit('position', channels[socket.channel].position); 
        socket.emit('zoom', channels[socket.channel].zoom);

        socket.broadcast.to(socket.channel).emit('user_add', socket.id);

        socket.on('mouse', function (msg) {
            users[socket.id].mouse = msg;
            socket.broadcast.to(socket.channel).emit('user_update', socket.id, users[socket.id]);
        });

        socket.on('position', function (msg) {
            channels[socket.channel].position = msg;
            socket.broadcast.to(socket.channel).emit('position', msg);
        });

        socket.on('zoom', function (msg) {
            channels[socket.channel].zoom = msg;
            socket.broadcast.to(socket.channel).emit('zoom', msg);
        });

        socket.on('view', function (msg) {
            channels[socket.channel].zoom = msg.zoom;
            channels[socket.channel].position = msg.position;
            socket.broadcast.to(socket.channel).emit('view', msg);
        });

        socket.on('change_name', function (name) {
            users[socket.id]['name'] = name;
            socket.broadcast.to(socket.channel).emit('user_update', socket.id, users[socket.id]);
        });

        socket.on('disconnect', function () {
            socket.broadcast.to(socket.channel).emit('user_del', socket.id);
            socket.join(socket.channel);
            channels[socket.channel].n_users -= 1.;
            delete users[socket.id];
        });
    });
});

// viewed at http://localhost:8080
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/scene.yaml',function(req,res){
  res.sendFile(path.join(__dirname+'/scene.yaml'));
});

app.get('/src/promise-7.0.4.min.js',function(req,res){
  res.sendFile(path.join(__dirname+'/src/promise-7.0.4.min.js'));
});

app.get('/src/leaflet-hash.js',function(req,res){
  res.sendFile(path.join(__dirname+'/src/leaflet-hash.js'));
});

app.get('/channels',function(req,res){
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(channels, null, 4));
});

app.get('/users',function(req,res){
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(users, null, 4));
});

server.listen(HTTPS_PORT, function() {
  console.log('server up and running at %s port', HTTPS_PORT);
});
