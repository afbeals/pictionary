var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname,"./public")));
app.get('/',function(req,res){
	res.render('index');
});
var server = app.listen(8000,function(){
	console.log("listening on port 8000");

});


// ==== socket.io ====
// https://github.com/socketio/socket.io/blob/master/docs/README.md
var io = require('socket.io').listen(server);
var chatHistory = '';
io.sockets.on('connection',function(socket){
	console.log('Connected!');

	// emit.setup will transfer chatHistory and any setup data for newcomers
	socket.emit('setup', {"chatHistory":chatHistory});
	//broadcast to all to update
	//socket.broadcast('setupGame');

	//once a connection with certain name:
	socket.on('chatUpdate', function(data){
		chatHistory = data.currentChat; // maintain server-side copy of chat for newcomers
		socket.broadcast.emit('chatUpdate', data);
	});

	socket.on('playerDrawing',function(package){
		socket.broadcast.emit('playerStartedDrawing',package);
	});

	socket.on('stopDrawing',function(){
		socket.broadcast.emit('playerStopDrawing');
	});

	//when receive startgame choose who is drawer
	socket.on('startGame',() => {

	})

// == Helpers 
	//send back to all connected clients
	socket.emit("identifier_for_message", {})

	//send back to everyone except newly connected
	socket.broadcast.emit("identifier_for_message", {});

	// socket disconect
	socket.on('disconnect',function(){
		// show others that user has left
		console.log('LEFT!')
		socket.emit('userDC', {"msg": 'User has left the game.'});
	})

});
