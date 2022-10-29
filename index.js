var portSIO = 14881;
var portH = 14882;
const io = require('socket.io')(portSIO);
var fs = require('fs');
const express = require('express');

const lo = console.log;
lo("___________________________________"+(new Date()+"").split(" ").slice(4,5));
lo("___________________________________sockIO:  "+portSIO);
lo("___________________________________http:    "+portH);


express()
 .use(express.static("C:/!MojePliki/file/htdocs/t/mm.tk/"))
 .get('/', function(req, res){
	 res.send(fs.readFileSync("C:/!MojePliki/file/htdocs/t/mm.tk/index.html", "utf8"))
 })
 .listen(portH);

const users = {};

io.on('connection', socket => {
	lo("con");
	socket.on('new-user2', name => {});
	socket.on('new-user', n => {
		if(n.room.startsWith("ox")){
			if(users[n.room] >= 2){
				socket.emit('err', "nie można dołączyć z powodu ilości osób");
				return;
			}
		}
		socket.join(n.room);
		socket.room = n.room;
		if(users[n.room] == undefined){
			users[n.room] = 1;
		}else{
			users[n.room]++;
		}

		var obj = {
			os: users[n.room],
			room: n.room
		}
		socket.emit('config', obj);
		socket.broadcast.emit('ref', obj);
		lo("client connect");
	});

	socket.on('disconnect', () => {
		users[socket.room]--;
		socket.broadcast.emit("ref", {room: getKeyByValue(users, users[socket.room]), os: users[socket.room]});
		lo("client disconnect");
	});

	socket.on('send', ms => {
		socket.broadcast.emit('data', ms);
	});

	socket.on('test', (data) => {
		lo('test');
	});

	socket.on('pageRef', (data) => {
		if(data.key == "878042563"){
			socket.broadcast.emit('pageRefresh', ".");
		}
	});
});

function getKeyByValue(object, value){
	return Object.keys(object).find(key => object[key] === value);
}