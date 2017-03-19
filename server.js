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
var io = require('socket.io').listen(server);

// socket.io https://github.com/socketio/socket.io/blob/master/docs/README.md
io.sockets.on('connection',function(socket){

	console.log('Connected!');

	//update chat:
	socket.on('chatUpdate', function(data){
		socket.broadcast.emit('chatUpdate', data);
	});

	//send back to all connected clients
	socket.emit("identifier_for_message", {})

	//send back to everyone except newly connected
	socket.broadcast.emit("identifier_for_message", {});

	// socket disconect
	socket.on('disconnect',function(){ console.log('Disconnect.. :(') })

});
