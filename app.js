var fs = require('fs');
var path = require('path');
var https = require('https');
var http = require('http');

var express = require('express');
var app = express();

var channels = { public : { channel: "public", position: { lat:40.70531887544228, lng: -74.00976419448853}, zoom: 15, n_users: 0 } };
var users = {};

var options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};
var HTTPS_PORT = 8080;

var server = https.createServer(options, app);
// var server = http.createServer(app);

var io = require('socket.io')(server);
io.on('connection', (socket) => {
    var channel_name = 'public';          // default channel

    // On join
    socket.on('join', (event) => {

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

        socket.on('mouse', (msg) => {
            users[socket.id].mouse = msg;
            socket.broadcast.to(channel_name).emit('user_update', socket.id, users[socket.id]);
        });

        socket.on('draggin', (msg) => {
            users[socket.id].draggin = msg;
            socket.broadcast.to(channel_name).emit('user_update', socket.id, users[socket.id]);
        });

        socket.on('position', (msg) => {
            channels[channel_name].position = msg;
            socket.broadcast.to(channel_name).emit('position', msg);
        });

        socket.on('zoom', (msg) => {
            channels[channel_name].zoom = msg;
            socket.broadcast.to(channel_name).emit('zoom', msg);
        });

        socket.on('view', (msg) => {
            channels[channel_name].zoom = msg.zoom;
            channels[channel_name].position = msg.position;
            socket.broadcast.to(channel_name).emit('view', msg);
        });

        socket.on('disconnect', () => {
            console.log(event.name, "leave");
            socket.broadcast.to(channel_name).emit('user_del', socket.id);
            socket.leave(channel_name);
            channels[channel_name].n_users -= 1.;
            delete users[socket.id];
        });
    });
});

// viewed at http://localhost:8080
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/scene.yaml', (req,res) => {
  res.sendFile(path.join(__dirname+'/scene.yaml'));
});

app.get('/src/promise-7.0.4.min.js', (req,res) => {
  res.sendFile(path.join(__dirname+'/src/promise-7.0.4.min.js'));
});

app.get('/src/leaflet-hash.js', (req,res) => {
  res.sendFile(path.join(__dirname+'/src/leaflet-hash.js'));
});

app.get('/channels', (req,res) => {
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(channels, null, 4));
});

app.get('/users', (req,res) => {
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(users, null, 4));
});

server.listen(HTTPS_PORT, () => {
    console.log('server up and running at %s port', HTTPS_PORT);
});
