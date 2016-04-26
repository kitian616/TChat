//util.js

function bodyParser(req, res, next) {
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
}

function postLogin(req, res) {
	if (req.body.nickname) {
		console.log(req.body.nickname);
		req.session.user = {
			"user": {
				"nickname": req.body.nickname
			}
		};
		res.redirect('/chat');
	}
}

function getLogin(req, res) {
	res.render('../views/login');
}

function getChat(req, res) {
	res.render('../views/chat', req.session.user);
}

exports.bodyParser = bodyParser;
exports.postLogin = postLogin;
exports.getLogin = getLogin;
exports.getChat = getChat;