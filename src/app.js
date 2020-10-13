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
    bold: Boolean,
    underline: Boolean,
    italic: Boolean
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
var bold = false
var underline = false
var italic = false

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
        bold = !bold
        socket.broadcast.emit('bold');
    })
    socket.on('underline', () => {
        underline = !underline
        socket.broadcast.emit('underline');
    })
    socket.on('italic', () => {
        italic = !italic
        socket.broadcast.emit('italic');
    })

    socket.on('save', async (evt) => {
        evt = evt.replace(' ', '_');
        let doc1 = new myModel({fileName: evt, buffer: fullText, bold: bold, underline: underline, italic: italic});
        try {
            await doc1.save();
        } catch (e) {
            await myModel.updateOne({fileName:evt},{ buffer: fullText});
        }
    })
    socket.on('loadall', async () => {
        let docs = await myModel.find({});
        socket.emit('loadallnext', docs);
    })
    socket.on('load', async (evt) => {
        let doc1 = await myModel.find({fileName: evt}).exec();
        fullText = doc1[0].buffer;
        bold = doc1[0].bold;
        underline = doc1[0].underline;
        italic = doc1[0].italic;
        // send if true to front
        socket.emit('message', fullText)
        socket.broadcast.emit('message', fullText)
    })
})
io.on('disconnect', (evt) => {
    log('some people left')
})