var fs = require('fs');
var path = require('path');
var https = require('https');
var http = require('http');

var express = require('express');
var app = express();

var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};
var HTTPS_PORT = 8080;

var server = https.createServer(options, app);
// var server = http.createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.broadcast.emit('user connected');

    socket.on('message', function (msg) { 
        // console.log(msg);
        socket.broadcast.emit('message', msg);
    });

    socket.on('disconnect', function () { });
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

server.listen(HTTPS_PORT, function() {
  console.log('server up and running at %s port', HTTPS_PORT);
});
