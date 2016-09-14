var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();

var http = require('http');
// var https = require('https');
// var options = {
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem')
// };

var channels = { public : { channel: "public", position: { lat:40.70531887544228, lng: -74.00976419448853}, zoom: 15, n_users: 0 } };
var users = {};

var HTTP_PORT = 80;
var HTTPS_PORT = 443;

var server_http = http.createServer(app);
// var server_https = https.createServer(options, app);

var io = require('socket.io')(server_http);
io.on('connection', function (socket) {
    var channel_name = 'public';          // default channel

    // On join
    socket.on('join', function (event) {

        // Create user 
        if (!users[socket.id]) {
            console.log("New User", event.name);
            users[socket.id] = event;   // store user data
        }

        // Remember channel
        channel_name = event.channel;
        // Add user to room
        socket.join(channel_name);

        // Create channel if there is not
        if (!channels[channel_name]) {
            console.log("New channel", channel_name);
            // Default initial position
            channels[channel_name] = { channel: channel_name, position: { lat:40.70531887544228, lng: -74.00976419448853}, zoom: 15, n_users: 0 };
        }
        channels[channel_name].n_users += 1.;

        // send actual position of channel
        socket.emit('position', channels[channel_name].position); 
        socket.emit('zoom', channels[channel_name].zoom);
        // socket.broadcast.to(channel_name).emit('user_update', socket.id, users[socket.id]);

        socket.on('mouse', function (msg) {
            users[socket.id].mouse = msg;
            socket.broadcast.to(channel_name).emit('user_update', socket.id, users[socket.id]);
        });

        socket.on('draggin', function (msg) {
            users[socket.id].draggin = msg;
            socket.broadcast.to(channel_name).emit('user_update', socket.id, users[socket.id]);
        });

        socket.on('position', function (msg) {
            channels[channel_name].position = msg;
            socket.broadcast.to(channel_name).emit('position', msg);
        });

        socket.on('zoom', function (msg) {
            channels[channel_name].zoom = msg;
            socket.broadcast.to(channel_name).emit('zoom', msg);
        });

        socket.on('view', function (msg) {
            channels[channel_name].zoom = msg.zoom;
            channels[channel_name].position = msg.position;
            socket.broadcast.to(channel_name).emit('view', msg);
        });

        socket.on('disconnect', function () {
            console.log(event.name, "leave");
            socket.broadcast.to(channel_name).emit('user_del', socket.id);
            socket.leave(channel_name);
            channels[channel_name].n_users -= 1.;
            delete users[socket.id];
        });
    });
});

// viewed at http://localhost:8080
app.get('/', function (req,res) {
  res.sendFile(path.join(__dirname+'/www/index.html'));
});

app.get('/scene.yaml', function (req,res) {
  res.sendFile(path.join(__dirname+'/www/scene.yaml'));
});

app.get('/client.js', function (req,res) {
  res.sendFile(path.join(__dirname+'/www/client.js'));
});

app.get('/lib/promise-7.0.4.min.js', function (req,res) {
  res.sendFile(path.join(__dirname+'/www/lib/promise-7.0.4.min.js'));
});

app.get('/lib/leaflet-hash.js', function (req,res) {
  res.sendFile(path.join(__dirname+'/www/lib/leaflet-hash.js'));
});

app.get('/channels', function (req,res) {
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(channels, null, 4));
});

app.get('/users', function (req,res) {
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(users, null, 4));
});

server_http.listen(HTTP_PORT, function () {
    console.log('HTTP Server up and running at %s port', HTTP_PORT);
});

// server_https.listen(HTTPS_PORT, function () {
//     console.log('HTTPS Server up and running at %s port', HTTPS_PORT);
// });
