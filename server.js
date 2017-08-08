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

// ==== decks ===== //
var decks = require('./pubic/js/decks.js');

// ==== socket.io ====
// https://github.com/socketio/socket.io/blob/master/docs/README.md
var io = require('socket.io').listen(server);
var chatHistory = '';
const decks = {
	animal: decks.animals,
	cartoons: decks.cartoons,
	places: decks.places,
	movies: decks.movies
}
const currentRooms = {
	currentRooms : [],
	numOfPlayers : 0,

	//remove all clients from room
	destroyAll () {

	},

	//remove single client from room
	removePlayer (){

	},
	//ban client
	banPlayer(){

	},

	get CurrentNumOfPlayers (){
		console.log(`currently connected players: ${this.numOfPlayers}`);
	}

}
const roomIdGenerator = function(roomName){
  min = Math.ceil(100000);
  max = Math.floor(9999999);
  let id = Math.floor(Math.random() * (max - min)) + min ;
  roomName += "(" + id + ")" ;
  return roomName ;
}
io.sockets.on('connection',function(socket){
//starting game
	//incr player count:
	++currentRooms.numOfPlayers;
	currentRooms.CurrentNumOfPlayers;
	//on connect, should emit to client to fire modal instead
	socket.emit('selectRoom');
	//upon selection of join a room
	socket.on('joinRoom',(roomName)=>{
		//join room
		socket.join(roomName);
		//fire any game joining functions needed to client
		//send over socket.id to store client side
		let socketId = Object.keys(io.sockets.sockets)[Object.keys(io.sockets.sockets).length -1];
		socket.emit('roomJoined',{roomName: roomName,id : socketId});
		//update game object for all in room
		//io.in(roomName).emit('getPlayers', 'object');
	});
	//upon selection of create a room
	socket.on('createRoom', (roomName) => {
		let roomHash = roomIdGenerator(roomName);
		//create room
		socket.join(roomHash);
		//fire any game creation functions needed to client
		//send over socket.id to store client side
		let socketId = Object.keys(io.sockets.sockets)[Object.keys(io.sockets.sockets).length -1];
		socket.emit('roomCreated',{roomName: roomHash,id : socketId});
		//get 
		//update game object for all in room;
		//io.in(roomName).emit('getPlayers', 'object');
	});
	//leave room
	socket.on('leaveRoom',(roomName)=>{
		//leave room
		socket.leave(roomName);
		//fire modal asking if they'd like to join another room;
		socket.emit('chooseAnotherRoom');
	});
	//send message to other clients letting know game will start soon:
	socket.on('setupGame',(roomName)=>{
		//send to all clients in room except sender;
		socket.broadcast.in(roomName).emit('settingUpGame', 'Getting ready to start the game!');
	});
	//choose from decks and send back to drawer
	socket.on('getDeck',(data)=>{
		//send the array back to all clients;
		io.in(data.roomName).emit('deckRecieved', decks[Object.keys(decks)[data.deckNumber]]);
	});
	//tell other clients in room to begin countdown timer
	socket.on('beginGame', (data) => {
		//send answer to all but sender
		socket.broadcast.in(data.roomName).emit('gameBegun',data.cardAn);
	});

//------------------------------------------------------------------------------------------
	// emit.setup will transfer chatHistory and any setup data for newcomers
	socket.emit('setup', {"chatHistory":chatHistory});
	//broadcast to all to update
	//socket.broadcast('setupGame');

	// once a connection with certain name:
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

	});

	socket.on('test',(roomName)=>{
		socket.join(roomName);
		var clients = io.sockets.adapter.rooms[roomName];
		console.log('my clients: ',clients);
		var clientList = Object.keys(io.sockets.sockets);
		io.to(testingThis).emit('messge','object');
	})

// == Helpers 
	//send back to connected clients
	socket.emit("identifier_for_message", {})

	//send back to everyone except newly connected
	socket.broadcast.emit("identifier_for_message", {});

	// socket disconect
	socket.on('disconnect',function(){
		//decrease player count:
		--currentRooms.numOfPlayers;
		// show others that user has left
		console.log('LEFT!')
		socket.emit('userDC', {"msg": 'User has left the game.'});
	})

});
