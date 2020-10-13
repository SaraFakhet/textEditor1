var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

/*mongoose*/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myDB', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("myDB connected");
});

var schema = mongoose.Schema({
    fileName: {
        type: String,
        unique: true,
    },
    buffer: String,
    // bold: bool
    // underline: bool
    // italic: bool
});
var save = mongoose.Schema({
    user: String,
    buffer: String,
    createdAt: Object,
});

var mySave = mongoose.model("save", save, "myCollection");
var myModel = mongoose.model("model", schema, "myCollection");

/*end mongoose*/

app.use('/', express.static(__dirname + '/public/'));
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

const hostname = '127.0.0.1';
const port = 3000;
const log = console.log;
var fullText = ""

server.listen(port, hostname, () => log(`Server running at http://${hostname}:${port}/`))
io.on('connection', (socket) => {
	socket.emit('message', fullText)
    socket.on('message', (evt) => {
        fullText = evt
        socket.emit('message', evt)
        socket.broadcast.emit('message', evt)
    })

    socket.on('version', async (evt) => {
        let version = new mySave({user: evt, buffer: fullText, createdAt: Date.now()});
        await version.save(function (err) {
            if (err) return console.error(err);
        })
    })

    socket.on('bold', () => {
        socket.broadcast.emit('bold')
    })
    socket.on('save', async (evt) => {
        // db => push fulltext, name, bold (bool), italic (bool), underline (bool)
        let doc1 = new myModel({fileName: evt, buffer: fullText});
        try {
            await doc1.save();
        } catch (e) {
            await myModel.updateOne({fileName:evt},{ buffer: fullText});
        }
    })
    socket.on('load', async (evt) => {
        let doc1 = await myModel.find({fileName: evt}).exec();
        fullText = doc1[0].buffer;
        socket.emit('message', fullText)
        socket.broadcast.emit('message', fullText)
    })
})
io.on('disconnect', (evt) => {
    log('some people left')
})