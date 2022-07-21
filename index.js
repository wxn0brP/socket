var portIO = 14881;
const io = require('socket.io')(portIO);

const lo = console.log;
lo("___________________________________"+(new Date()+"").split(" ").slice(4,5));
lo("___________________________________IO:   "+ portIO);

serIO();

function serIO(){
	const users = {};
	var rooms = [];

	io.on('connection', socket => {
		socket.on('new-user2', name => {});
		socket.on('new-user', n => {
			var index = 0;
			for(var i=0; i<rooms.length; i++){
				if(rooms[i] == n.room)index++;
			}
			users[socket.id] = n.room;
			lo("user connect");
			rooms.push(n.room);
			if(index == 0 || index == 1){
				var obj = {
					os: index+1,
					room: n.room
				}
				socket.emit('config', obj);//return data
				socket.broadcast.emit('ref', obj);//return data
			}else{
				socket.emit('err', "nie można dołączyć z powodu ilości osób");
			}
			//lo(rooms);
		});
		socket.on('disconnect', () => {
			var index = rooms.indexOf(users[socket.id]);
			lo("user disconnect");
			socket.broadcast.emit("ref", {room: users[socket.id], os: index+1});
			rooms.splice(index, 1);
			delete users[socket.id];
			//lo(rooms);
		});
		socket.on('send', ms => {
			socket.broadcast.emit('data', ms);//send data others
		});

	});
}
