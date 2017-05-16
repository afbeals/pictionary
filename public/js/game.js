'use strict'
// == variables
//on connection create player from class constructor
class PlayerPayload{
	constructor(name,roomName,id){
		this.name = name;
		this.roomName = roomName;
		this.id = id;
	}
}

class Player extends PlayerPayload{
	constructor(name,roomName,id){
		super(name,roomName,id);
		this.guess = "";
		this.score = 0;
		this.hasDrawn = false;
		this.draw = false;
		this.currentDrawer = false;
		this.spectate = false;
		this.leader = false;
	}

	get currentScore () {
		return `${this.name} currently has a score of ${this.score}`;
	}

	get currentGuess () {
		return `${this.name} guessed ${this.guess}`;
	}

	set updateScore(num){
		this.score += num;
	}
}

let player, playerPayload;
const createPlayer = (name,roomName,id) => {
   playerPayload = new PlayerPayload(name,roomName,id);
   player = new Player(name,roomName,id);
}
createPlayer();



const table = document.getElementById('table');
const game = {
				score : 0,
				playersList : [],
				hasntDrawn : [],
				cardAn: '',
				timer: 10,
				deck : '',
				finalRound: false
			}

let tableString = "";
let createTable;
let chooseCard;
let getDeck;
let timer;
let beginGame;
let showDrawingTools;
let countdown;
let messageColumn;
let endGame;
let showAnswer;
let createCanvas;
let nextRound;

// == card functionality
// build out front end table based on chosen deck
createTable = (cards) => {
	cards.forEach((e, i) => {
	    tableString +=`
		<div class="card">
			<div class="cardInner active">
				<div class="front">
					<span class="topL"></span>
					<span class="topR"></span>
					<span class="bottomL"></span>
					<span class="bottomR"></span>
					${e}
				</div>
				<div class="back">
					<h3>${e}</h3>
					<button class="notPossible">
						<i aria-hidden="true" class="fa fa-times"></i>
					</button>
					<button class="Possible">
						<i aria-hidden="true" class="fa fa-exclamation"></i>
					</button>
					<button class="Final">
						<i aria-hidden="true" class="fa fa-check"></i>
					</button>
				</div>
			</div>
		</div>
		`
	});
	table.innerHTML = tableString;
}

showAnswer = (ans) =>{
	let answerString = `<div class="answer">
							<div class="animate">
								<p class="step1">
									you're drawing...
								</p>
								<p class="step2">
									${ans}
								</p>
							</div>
							
        					<div class="left">
					            <p>Drawing</p>
					        </div>
					        <div class="right">
					            <p>${ans}</p>
					        </div>
					    </div>`;
	table.innerHTML = answerString;
}

chooseCard = (min,max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  game.cardAn = game.deck[Math.floor(Math.random() * (max - min)) + min];
  showAnswer(game.cardAn);
  //beginGame(game.cardAn);
  socket.emit('beginGame',{cardAn: game.cardAn, roomName: playerPayload.roomName});
}

// select deck from server
getDeck = (min,max,callback) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  let deckNumber = Math.floor(Math.random() * (max - min)) + min;
  socket.emit('getDeck',{deckNumber: deckNumber,roomName: playerPayload.roomName});
}
countdown = (time,callback) => {
	let int = setInterval(()=>{
		--time;
		if(time<=0){
			document.getElementById('countdownTimer').innerHTML = `Go!!!`;
			clearInterval(int);
			callback();
		}else{
			document.getElementById('countdownTimer').innerHTML = `${time} seconds left`;
		}
	},1000);
}
timer = (time) => {
	let int = setInterval(()=>{
		--time;
		if(time<=0){
			clearInterval(int);
			if(game.hasntDrawn <= 1){
				endGame();
			}else{
				nextRound();
			}
		}else if(time>game.timer){

		}else if(time<=game.timer){
			document.getElementById('roundTimer').innerHTML = `${time}`;
		}
	},1000);
}
nextRound=()=>{
	if(game.cardAn.toLowerCase() == player.guess.toLowerCase()){
		player.score+100;
	};
	selectRandomPlayer(); //<= update player info, remove player from list of hasnt drawn, run functions to 
	//clear screen


}
endGame=()=>{
	if(game.cardAn.toLowerCase() == player.guess.toLowerCase()){
		player.score+100;
	};
	displayScores(); //<= display all scores, select winner, display reset button
}
//start timer and show cardAn to player
beginGame = (answer) => {
	//if drawer
	if(player.draw){
		//show answer to player (show in same modal above countdown timer)
		//possibly start an animated clock;
		console.log('ran');
		//start countdown modal > run timer
		countdown(6, timer(game.timer+6));
	}else if(!player.draw && !player.spectate){
		//if player and not spectator
		countdown(6, timer(game.timer+6));
	}else if(player.spectate && !player.draw){
		//if just spectator
		countdown(6, timer(game.timer+6));
	}
}

//spectate and non-drawer countdown
socket.on('gameBegun', (answer) => {
	console.log('aefa');
	game.cardAn = answer;
	beginGame(answer);
})

showDrawingTools = () => {
	//show content with class drawing
	if (player.draw){document.body.classList.add('drawing')};
}

socket.on('assignID', (id) => playerPayload.id = id );


// == start game ==

const StrButton = document.getElementById('startGame');
StrButton.addEventListener('click', (e) =>{
	socket.emit('gameCountDown', playerPayload);
	createCanvas();
});

// == ready game ==

function beginCountDown(){
	document.body.classList.add('pregame-countdown');
	// animations
	$('.lobbyActionButtons').fadeOut(125, function(){
		$('.gameCountdown').hide().removeClass('hidden').fadeIn(125);
	});

	var time = 5,
		el = document.querySelector('#screen .content .pregame-countdown .pregame-time');
	el.innerText = time + ' seconds';
	var interval = setInterval(function(){
		--time;
		if (time > 1) {
			el.innerText = time + ' seconds';
		} else {
			if (time === 0) {
				clearInterval(interval);
				socket.emit('startGame', playerPayload);
				el.innerText = time + ' seconds';
				$('#screen').fadeOut(125);
				if(player.leader){getDeck(0,4)};
			} else {
				el.innerText = time + ' second';
			}
		}
	}, 1000)
}





//let client know game beginning soon:
socket.on('beginCountDown',()=> { console.log('test'); beginCountDown() });

//receive deck after getDeck() call
socket.on('deckRecieved',(data) => {
	game.deck = data;
	if(player.draw == true){
		chooseCard(0,game.deck.length - 1);
	}else if(player.draw == false && player.spectate == false){
		createTable(game.deck);
	}
});

let NGButton = document.getElementById('newGameBtn');
NGButton.addEventListener('click', (e) =>{
	let roomName = document.getElementsByName('bunk')[0].value;
	let playerName = document.getElementsByName('username')[0].value;
	playerPayload.name = playerName;
	socket.emit('createRoom',{'roomName':roomName,'playerName':playerName});
});

socket.on('roomCreated',(msg) => {
	createPlayer(playerPayload.name, msg.roomName, playerPayload.id);
	document.getElementById('gameId').innerHTML = `${msg.roomName}`;
	player.draw = true;
	player.currentDrawer = true;
	player.leader = true;
	document.body.classList.add('roomLeader')
	showDrawingTools();
	addToPlayerList(playerPayload);
	drawGameLobby();
});


let JRButton = document.getElementById('joinGameBtn');
JRButton.addEventListener('click', (e) =>{
	let roomName = document.getElementsByName('gameId')[0].value;
	let playerName = document.getElementsByName('username')[0].value;
	createPlayer(playerName, roomName, playerPayload.id);
	socket.emit('joinRoom',playerPayload);
});

socket.on('newPlayerJoinedRoom', (obj) => {
	addToPlayerList(obj);
	drawGameLobby();
	if (player.leader){
		socket.emit('sendListOfPlayers',{list: game.playersList, room: obj.roomName, id: obj.id, chatHistory: messageColumn.innerHTML});
	}
});

socket.on('getExistingPlayers', (obj) => {
	overWritePlayersList(obj.list);
	drawGameLobby();
	messageColumn.innerHTML = obj.currentChat;
});

socket.on('chooseAnotherRoom',()=>{
	//fire modal that allows client to emit joinRoom
});

// ===== game lobby =====


const preGameLobby = document.getElementById('gameLobby');
function addToPlayerList(obj){
	return game.playersList.push(obj);
}
function removePlayerFromList(arr,playerId){
	arr.forEach((c,i,a)=>{
		if(c.id == playerId){
			arr.splice(i,1)
		}
	})
}
function overWritePlayersList(array){
	game.playersList = array;
}
function drawGameLobby(){
	preGameLobby.innerHTML = '';
	game.playersList.forEach(function(obj){
		preGameLobby.innerHTML +=
		`<li class="loading" data-id="${obj.id}">
            <span class="shownUserName">${obj.name}</span>
            <div class="userStatus">
                <div class="loading_dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="readyToPlay">
                    <span class="statusText">Ready</span>
                    <span class="statusIcon fa fa-check"></span>
                </div>
                <div class="spectating">
                    <span class="statusText">Spectating</span>
                    <span class="statusIcon fa fa-eye"></span>
                </div>
            </div>
        </li>`;
	});
}
socket.on('updateAllGameLobbies', (array) => {
	overWritePlayersList(array);
	drawGameLobby();
});

socket.on('userDC',(user)=>{
	removePlayerFromList(game.playersList,user.userId);
	//overWritePlayersList(playersList);
	drawGameLobby();
});

const readyBtn = document.getElementById('readyButton');
readyBtn.addEventListener('click', () => {
	playerReady();
	socket.emit('playerReadyToPlay', playerPayload);
	createCanvas();
});
function playerReady(event, id) {
	if (!id) { id = playerPayload.id; }
	const playerLi = preGameLobby.querySelector('[data-id="'+ id +'"]');
	playerLi.classList.remove('loading','spectating');
	playerLi.classList.add('readyToPlay');
}
socket.on('playerIsReady', (obj) => playerReady(event, obj.id));

const spectatingBtn = document.getElementById('spectateButton');
spectatingBtn.addEventListener('click', () => {
	playerSpectating();
	socket.emit('playerReadyToSpectate', playerPayload);
	createCanvas();
});
function playerSpectating(event, id){
	if (!id) { id = playerPayload.id; }
	const playerLi = preGameLobby.querySelector('[data-id="'+ id +'"]');
	playerLi.classList.remove('loading','readyToPlay');
	playerLi.classList.add('spectating');
	player.spectate = true;
}
socket.on('playerIsSpectating', (obj) => playerSpectating(event, obj.id));

// ===== END game lobby END =====





//global object setup (from chat-feature-branch)
var startGame = function(){
    $('.intro').fadeOut(250, function(){
        $('.stage').fadeIn(250);
    });
    if (PIC.user.joinGame.length > 0){
        // do something to find that game
    } else {
        // do stuff to start new game
    }
}

let PIC = {
    user: {},
    game: {
        "startGame": startGame
    }
}
