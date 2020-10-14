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
});

var schema = mongoose.Schema({
    fileName: {
        type: String,
        unique: true,
    },
    buffer: String,
    bold: Boolean,
    underline: Boolean,
    italic: Boolean,
	align: String,
	font: String,
	fontSize: Number,
});
var saveSchema = mongoose.Schema({
    fileName: String,
    user: String,
    buffer: String,
    createdAt: Object,
});

var mySave = mongoose.model("save", saveSchema, "myCollection2");
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
var align = 'left'
var font = 'sans-serif'
var fontSize = 14
var currentFileName = ""

server.listen(port, hostname, () => log(`Server running at http://${hostname}:${port}/`)) // lance le serveur
io.on('connection', async (socket) => {
    /* parametrage de l'affichage à la 1ere connexion d'un nouveau user */
	socket.emit('message', fullText)
    socket.emit('bold', bold);
    socket.emit('underline', underline);
    socket.emit('italic', italic);
    socket.emit('align', align);
    socket.emit('font', font);
    socket.emit('fontSize', fontSize);
    if (currentFileName !== "") {
        let fileSaved = await mySave.find({fileName:currentFileName});
        socket.emit('displaysaved', fileSaved);
    }
    /* transmission des modifications à tous les users*/
    socket.on('message', (evt) => {
        fullText = evt
        socket.emit('message', evt)
        socket.broadcast.emit('message', evt)
    })

    /* emission modifications de paramètrages d'affichage appelées par le front à tous les users*/

    socket.on('bold', () => {
        bold = !bold;
        socket.broadcast.emit('bold', bold);
    })
    socket.on('underline', () => {
        underline = !underline
        socket.broadcast.emit('underline', underline);
    })
    socket.on('italic', () => {
        italic = !italic;
        socket.broadcast.emit('italic', italic);
    })
	socket.on('align', async (value) => {
		align = value;
        socket.broadcast.emit('align', value);
    })
	socket.on('font', async (value) => {
		font = value;
        socket.broadcast.emit('font', value);
    })
	socket.on('fontSize', async (value) => {
		fontSize = value;
        socket.broadcast.emit('fontSize', value);
    })

    socket.on('save', async (evt) => {
        evt = evt.replace(/ /g, '_');
        let doc1 = new myModel({fileName: evt, buffer: fullText, bold: bold, underline: underline, italic: italic, align: align, font: font, fontSize: fontSize});
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

    socket.on('trashall', async (evt) => {
        let docs = await myModel.find({});
        socket.emit('trashallnext', docs);
    })

    socket.on('load', async (evt) => {
        let doc1 = await myModel.find({fileName: evt}).exec();
        fullText = doc1[0].buffer;
        bold = doc1[0].bold;
        underline = doc1[0].underline;
        italic = doc1[0].italic;
        socket.emit('bold', bold);
        socket.broadcast.emit('bold', bold);
        socket.emit('underline', underline);
        socket.broadcast.emit('underline', underline);
        socket.emit('italic', italic);
        socket.broadcast.emit('italic', italic);
		
		align = doc1[0].align;
		socket.emit('align', align);
        socket.broadcast.emit('align', align);
		
		font = doc1[0].font;
		socket.emit('font', font);
        socket.broadcast.emit('font', font);
		
		fontSize = doc1[0].fontSize;
		socket.emit('fontSize', fontSize);
        socket.broadcast.emit('fontSize', fontSize);

        socket.emit('message', fullText)
        socket.broadcast.emit('message', fullText)

        let fileSaved = await mySave.find({fileName:evt});
        currentFileName = evt;
        socket.emit('displaysaved', fileSaved);
        socket.broadcast.emit('displaysaved', fileSaved);
    })

    socket.on('trash', async (evt) => {
        await myModel.deleteOne({fileName: evt});
        await mySave.deleteMany({fileName: evt});
    })

    socket.on('version', async (evt, filename) => {
        filename = filename.replace(/ /g, '_');
        currentFileName = filename;
        let version = new mySave({fileName: filename, user: evt, buffer: fullText, createdAt: Date.now()});
        await version.save(function (err) {
            if (err) return console.error(err);
        })
        let fileSaved = await mySave.find({fileName:filename});
        socket.emit('displaysaved', fileSaved);
        socket.broadcast.emit('displaysaved', fileSaved);
    })
})