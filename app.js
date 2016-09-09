var fs = require( 'fs' );
var app = require('express')();
var https = require('https');
var path = require('path');

var SERVER_KEY = 'key.pem';
var SERVER_CRS = 'cert.pem';
var HTTP_PORT = 8080;

var server = https.createServer({
    key: fs.readFileSync(SERVER_KEY),
    cert: fs.readFileSync(SERVER_CRS)
},app);
server.listen(HTTP_PORT);

var io = require('socket.io').listen(server);

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
