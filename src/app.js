var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

/*mongoose*/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myDB', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("myDB connected");
});

var schema = mongoose.Schema({
    name: String
});

var Model = mongoose.model("model", schema, "myCollection");
var doc1 = new Model({ name: "John"});
doc1.save(function(err, doc) {
    if (err) return console.error(err);
    console.log("Document inserted succussfully!");
});

/*end mongoose*/

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