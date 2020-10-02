var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '../node_modules'));
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

const hostname = '127.0.0.1';
const port = 3000;
const log = console.log;
var fullText = ""

server.listen(port, hostname, () => log(`Server running at http://${hostname}:${port}/`))
io.on('connection', (socket) => {
    log('connected')
	socket.broadcast.emit('message', fullText)
    socket.on('message', (evt) => {
		fullText = evt
        socket.broadcast.emit('message', evt)
    })
})
io.on('disconnect', (evt) => {
    log('some people left')
})