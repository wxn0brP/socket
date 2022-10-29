var portSIO = process.env.PORT || 14881; //w glitch 3000
const io = require('socket.io')(portSIO);

const lo = console.log;
lo("___________________________________"+(new Date()+"").split(" ").slice(4,5));
lo("___________________________________sockIO:  "+portSIO);

const users = {};

io.on('connection', socket => {
	lo("con");
	socket.on('new-user2', name => {});
	socket.on('new-user', n => {
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
});

function getKeyByValue(object, value){
	return Object.keys(object).find(key => object[key] === value);
}
