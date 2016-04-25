//index.js
//load the things we need
var express = require('express');
var app = express();
var http = require('http').Server(app);
var session = require('express-session');
var io = require('socket.io')(http);
_ = require('underscore');

//set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
//add session surport
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.get('/', function (request, response) {
	// response.sendFile(__dirname + '/static/welcome.html');
	response.render(__dirname + '/views/login');
});

app.get('/css/components.css', function (request, response) {
	response.sendFile(__dirname + '/css/components.css');
});
app.get('/css/base.css', function (request, response) {
	response.sendFile(__dirname + '/css/base.css');
});
app.get('/css/main.css', function (request, response) {
	response.sendFile(__dirname + '/css/main.css');
});
app.get('/css/login.css', function (request, response) {
	response.sendFile(__dirname + '/css/login.css');
});

app.get('/socket.io/socket.io.js', function (request, response) {
	response.sendFile(__dirname + '/socket.io/socket.io.js');
});

app.get('/js/jquery-2.2.0.min.js', function (request, response) {
	response.sendFile(__dirname + '/js/jquery-2.2.0.min.js');
});

app.use(function(req, res, next) {
	var buffers = [];
	req.on('data', function(data) {
		buffers.push(data);
	});
	req.on('end', function() {
		var body = {};
		var rawBody = Buffer.concat(buffers).toString();
		_.each(rawBody.split('&'), function(e) {
			var pair = e.split('=');
			body[pair[0]] = pair[1];
		});	
		req.body = body;
		next();
	});
});

app.post('/login', function(req, res) {
	debugger;
	if (req.body.nickname) {
		console.log(req.body.nickname);
		//req.session.col = 9;
		req.session.user = {
			"user": {
				"nickname": req.body.nickname
			}
		};
		req.session.testNum = 9;
		res.redirect('/chat');
		// res.status(303).render(__dirname + '/views/chat', {
		// 	user: {
		// 		"nickname": req.body.nickname
		// 	}
		// });
	}
});

app.get('/chat', function(req, res) {
	debugger;
	res.render(__dirname + '/views/chat', req.session.user);
});

///////////////
//define user//
///////////////
var GetUser = function(id, name){
	return {'id': id, 'name': name};
}
var users = {};
var count = 0;
////////////////

//define message//
//////////////////
var GetUserDataMsg = function(command, data){
	return {'command': command, 'data': data};
}
//////////////////


///SOCKET.IO//
//////////////
io.on('connection', function(socket) {
	var curUser = GetUser(++count, 'lelei');
	var curId = socket.id;
	var curData = {};
	users[curId] = curUser;
	curData[curId] = curUser;
	console.log('a user %s connected', socket.id);
	var curSocketMsg = []; //发给当前上线人的消息，需发送所有在线人的信息
	var broadcastMsg = []; //发给其他人的消息，仅发送当前上线人的信息
	curSocketMsg.push(GetUserDataMsg('clr', null));
	curSocketMsg.push(GetUserDataMsg('add', users));
	broadcastMsg.push(GetUserDataMsg('add', curData))
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
		socket.broadcast.emit('userData', [GetUserDataMsg('del', socket.id)]);
	});
});


var server = http.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('http://%s:%s', host, port); 
});
