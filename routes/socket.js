var user = require("../models/user");
var message = require("../models/message");

var users = {};
var count = 0;

function onConnection(socket) {
	var curUser = user.getUser(++count, 'lelei');
	var curId = socket.id;
	var curData = {};
	users[curId] = curUser;
	curData[curId] = curUser;
	console.log('a user %s connected', socket.id);
	var curSocketMsg = []; //发给当前上线人的消息，需发送所有在线人的信息
	var broadcastMsg = []; //发给其他人的消息，仅发送当前上线人的信息
	curSocketMsg.push(message.getUserDataMsg('clr', null));
	curSocketMsg.push(message.getUserDataMsg('add', users));
	broadcastMsg.push(message.getUserDataMsg('add', curData))
	socket.emit('userData', curSocketMsg);	//发送消息给当前上线人
	socket.broadcast.emit('userData', broadcastMsg); //广播消息给其他人
	//debugger;
	socket.on('message', function (msg) {
		console.log('message:' + msg.socketId);
		//all the others will get.
		socket.broadcast.to(msg.socketId).emit('message', msg);
		//only sender will get.
		//socket.emit('feedback');
	});
	socket.on('disconnect', function() {
		delete users[socket.id];
		console.log('a user %s leave', socket.id);
		socket.broadcast.emit('userData', [message.getUserDataMsg('del', socket.id)]);
	});
}

exports.onConnection = onConnection;