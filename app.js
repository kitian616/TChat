//app.js

//load the things we need
var express = require('express');
var app = express();
var http = require('http').Server(app);
var session = require('express-session');
var io = require('socket.io')(http);
_ = require('underscore');
//load user module
var util = require('./routes/util');
var socket = require('./routes/socket')

//set the view engine to ejs
app.set('view engine', 'ejs');

//set static folders
app.use('/public/css', express.static(__dirname + '/public/css'));
app.use('/public/js', express.static(__dirname + '/public/js'));
app.use('/public/libs', express.static(__dirname + '/public/libs'));
app.use('/src/sass', express.static(__dirname + '/src/sass'));

//add session surport
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
//parser post data to req.body
app.use(util.bodyParser);

// router
app.get('/', util.getLogin);
app.post('/login', util.postLogin);
app.get('/chat', util.getChat);

//socket.io
io.on('connection', socket.onConnection);

//start server
var server = http.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('http://%s:%s', host, port); 
});
