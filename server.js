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
const decks = {
	animal: ['a','b','c','d','e'],
	event: ['f','g','h','i','j'],
	name: ['karina','allan','trevor','sophie','megan','haley','curtis','cleri'],
	place: ['oregon','washington','california','montana','idaho','colorado']
}
const currentRooms = {
	rooms : {},
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
	++currentRooms.numOfPlayers;
	currentRooms.CurrentNumOfPlayers;
	// assign id immediately!
	socket.emit('assignID', socket.id);

// ==== BEFORE GAME ====local
// =====================

	// Create room
	socket.on('createRoom', (obj) => {
		let roomHash = roomIdGenerator(obj.roomName);
		if(!currentRooms[roomHash]){
			socket.join(roomHash);
			currentRooms.rooms[socket.id] = roomHash;
			//console.log(io.sockets.adapter.sids[socket.id],socket.id);
			socket.emit('roomCreated',{roomName: roomHash, username: obj.playerName});	
		}
		else{
			socket.emit('roomExists',{'msg':"please try that room again"});
		}
	});

	// Join existing room
	socket.on('joinRoom',(obj)=>{
		socket.join(obj.roomName);
		currentRooms.rooms[socket.id] = obj.roomName;
		socket.to(obj.roomName).emit('newPlayerJoinedRoom', {roomName: obj.roomName, name: obj.name, id: obj.id});
	});

	// send joined player list of already existing players
	socket.on('sendListOfPlayers', (obj) => {
		socket.to(obj.id).emit('getExistingPlayers', {list: obj.list, currentChat: obj.chatHistory});
	});

	socket.on('playerReadyToPlay',(obj) => {
		socket.to(obj.roomName).emit('playerIsReady', obj);
	});

	socket.on('playerReadyToSpectate',(obj) => {
		socket.to(obj.roomName).emit('playerIsSpectating', obj);
	});

// ==== DURING GAME ====
// =====================

	// send message to other clients letting know game will start soon:
	socket.on('gameCountDown',(obj)=>{
		io.in(obj.roomName).emit('beginCountDown', '');
	});

	// choose from decks and send back to drawer
	socket.on('getDeck',(data)=>{
		io.in(data.roomName).emit('deckRecieved', decks[Object.keys(decks)[data.deckNumber]]);
	});

	// tell other clients in room to begin countdown timer
	socket.on('beginGame', (data) => {
		io.in(data.roomName).emit('gameBegun',data.cardAn);
	});

	// once a connection with certain name:
	socket.on('chatUpdate', function(data){
		chatHistory = data.currentChat; // maintain server-side copy of chat for newcomers
		//socket.broadcast.emit('chatUpdate', data);
		socket.to(data.player.roomName).emit('chatUpdate', data);
	});

	socket.on('playerDrawing',function(package){
		socket.to(package.player.roomName).emit('playerStartedDrawing',package.ctxPackage);
	});

	socket.on('stopDrawing',function(){
		socket.broadcast.emit('playerStopDrawing');
	});

	socket.on('getScore',(data)=>{
		socket.to(data.playerId).emit('getScore',{leader:data.leader});
	});

	socket.on('sendScore',(data)=>{
		// emit to back to leader socket.to(data.leader).emit('sendScore',data.score);
		socket.to(data.leader).emit('scoreSent',{score:data.score,player:data.player});
	});

	socket.on('updateAllScores',(data)=>{
		io.in(data.roomName).emit('updateAllScores',{scores:data.groupScores});
	});

	socket.on('selectedNewPlayer',(data)=>{
		socket.to(data.id).emit('selectedPlayer');
	});

	socket.on('startNextRound',(data)=>{
		io.in(data.roomName).emit('nextRoundStarted');
	});

	socket.on('updateDrawerList',(data)=>{
		socket.to(data.roomName).emit('updateDrawerList',data);
	})

// ==== AFTER GAME ====
// =====================

	// leave room
	socket.on('leaveRoom',(roomName)=>{
		socket.leave(roomName);
		// socket.emit('chooseAnotherRoom');
	});

	socket.on('restartGame',(data)=>{
		io.in(data.roomName).emit("restartGame");
	});

	socket.on('openCanvas',(data)=>{
		io.in(data.roomName).emit("openCanvas");
	});

	socket.on('setRestartLeader',(data)=>{
		io.in(data.roomName).emit('setRestartLeader',data);
	});


//------------------------------------------------------------------------------------------

// == Helpers
	// send back to connected clients
	socket.emit("identifier_for_message", {})

	// send back to everyone except newly connected
	socket.broadcast.emit("identifier_for_message", {});

	// socket disconect
	socket.on('disconnect',function(){
		--currentRooms.numOfPlayers;
		//console.log('afea',io.sockets.adapter.sids[socket.id],socket.id);
		//socket.emit('userDC', {userId: socket.id});
		socket.to(currentRooms.rooms[socket.id]).emit('userDC', {userId: socket.id});
	});
});
