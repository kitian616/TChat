$(document).ready(function(){
	///UI HEIGHT
	var header_height = $("#chat-area-haeder").outerHeight();
	var control_bar_height = $("#control-bar").outerHeight();
	function setMessageHeight () {
		var window_height = $(window).height();
		$("#side-area").outerHeight(window_height);
		$("#message").outerHeight(window_height - header_height - control_bar_height);
	}
	//END UI HEIGHT
	///STROLL
	function scrollToBottom() {
		var scrollHeight =$("#message")[0].scrollHeight;
		$("#message").scrollTop(scrollHeight);
	}
	//END STROLL
	///UI SEND BUTTON
	$("#inputText").keyup(function(){
		if($(this).val()){
			$("#send").css("color", "#3CAF36");
		} else {
			$("#send").css("color", "black");
		}
	});
	$("#send").click(function(){
		$(this).css("color", "black");
	});
	//END UI SEND BUTTON
	///WINDOW  READY
	setMessageHeight();
	//END WINDOW READY
	///WINDOW  RESIZE
	$(window).resize(function (event) {
		setMessageHeight();
		scrollToBottom();
	})
	//END WINDOW RESIZE
	///USER LIST CLICK
	var lastFocus;
	$("#ip-table").on('click','li',function(e){
		$(lastFocus).removeClass('focus');
		$(this).addClass('focus');
		$("#title").text("/#" + $(this).attr("id"));
		lastFocus = this;
	});
	//END USER LIST CLICK
	///CHATTING DATA
	var talks={};
	var addTalk = function(id){
		talks[id] = {'messages':[]};
	}
	var createMessage = function(socketId, text){
		return {'socketId': socketId, 'text': text};
	}
	var addMessage= function(talkId, socketId, text){
		talks[talkId].messages.push(createMessage(socketId, text));
	}
	//END CHATTING DATA
	///SOKET IO
	function beautifySectionId(id){
		return id.substring(2); //socket.id /#.... => ...
	}

	var socket = io();
	$("form").submit(function(){
		var inputTextVal = $("#inputText").val();
		if (inputTextVal) {
			$("#message").append($("<li class='bubble me'></li>").text(inputTextVal));
			scrollToBottom();
			socket.emit('message', createMessage($("#title").text(), inputTextVal));
			$("#inputText").val('');
		}
		return false;
	});
	socket.on('message', function (msg) {
		$("#message").append($("<li class='bubble'></li>").text(msg.text));
		scrollToBottom();
	});
	socket.on('userData', function (msg) {
		msg.forEach(function(key) {
			var command = key.command;
			var data = key.data;
			if(command == 'clr'){
				$("#ip-table").empty();
			}
			else if(command == "add"){
				for(var user in data){
					if(socket.id !== beautifySectionId(user)){
						$("#ip-table").append($('<li id="'+beautifySectionId(user)+'" class="id-item"></li>').text(user));
					}
				}
			} else if(command == "del"){
				$("#ip-table #" + beautifySectionId(data)).remove();
			}
		});
		scrollToBottom();
	});
	socket.on('feedback', function (msg) {
		$("#message").append($("<li class='bubble'></li>").text("get"));
	});
	//END SOKET IO
});
