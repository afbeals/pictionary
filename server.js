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
	//once a connection with certain name:
	socket.on('name_of_connection from client', function(data){
		
	});

	//send back to all connected clients
	socket.emit("identifier_for_message", {})

	//send back to everyone except newly connected
	socket.broadcast.emit("identifier_for_message", {});

});