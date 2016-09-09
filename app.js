var io = require('socket.io')(8080);

io.on('connection', function (socket) {
    socket.broadcast.emit('user connected');

    socket.on('message', function (msg) { 
        console.log(msg);
        socket.broadcast.emit('message', msg);
    });

    socket.on('disconnect', function () { });
});