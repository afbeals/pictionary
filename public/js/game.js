'use strict'
// == variables
//on connection create player from class constructor
class Player{
	constructor(){
		this.name = '';
		//this.number = number;
		this.guess = "";
		this.score = 0;
		this.hasDrawn = false;
		this.draw = false;
		this.currentDrawer = false;
		this.roomName = "";
		this.id = "";
		this.spectate = false;
	}

	score () {
		return `${this.name} currently has a score of ${this.score}`;
    }
	
	guess () {
		return `${this.name} guessed ${this.guess}`;
    }

}
const player = new Player();
const table = document.getElementById('table');
const game = {
				score : 0,
				//totalPlayers: 0,
				//readyPlayers: 0,
				players : [],
				cardAn: '',
				timer: 60,
				deck : ''
			}

let tableString = "";
let createTable;
let chooseCard;
let getDeck;
let timer;
let beginGame;
let showDrawingTools;
let countdown;


let endGame;
//-- need to set up end game / need to set up players picking cards

// == card functionality
// build out front end table based on chosen deck
createTable = (cards) => {
	cards.forEach((e, i) => {
	    tableString +=`<div class="card"><div class="cardInner test"><div class="front">${e}</div><div class="back"><button class="notPossible">Darken</button><button class="Possible">Possible</button><button class="Final">Final Choice</button></div></div></div>`
	});
	table.innerHTML = tableString;
} 

chooseCard = (min,max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  game.cardAn = game.deck[Math.floor(Math.random() * (max - min)) + min];
  //begin the game
  beginGame(game.cardAn);
  socket.emit('beginGame',{cardAn: game.cardAn, roomName: player.roomName});
}

// select deck from server
getDeck = (min,max,callback) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  let deckNumber = Math.floor(Math.random() * (max - min)) + min;
  socket.emit('getDeck',{deckNumber: deckNumber,roomName: player.roomName});
}
countdown = (time,callback) => {
	for(let i = time; i > 0; --i) {
	    let int = setInterval(() => {
	        //document.getElementById("modalTimer").innerHTML = "Game starts in " + i + "...";
	        i-- || clearInterval(int); //document.getElementById("modalTimer").innerHTML = "Go!"; //hide modal
	    }, 1000);
	};
	callback;
}
timer = (time) => {
	//then begin countdown timer 
	for(let i = time; i > 0; --i) {
	    let int = setInterval(() => {
	        //document.getElementById("timerDisplay").innerHTML = "Time remaining " + i;
	        i-- || clearInterval(int); //document.getElementById("timerDisplay").innerHTML = "Times Up!"; 
	    }, 1000);
	};
	//endGame();
}
//start timer and show cardAn to player
beginGame = (answer) => {
	//if drawer
	if(player.draw){
		//show answer to player (show in same modal above countdown timer)
		//possibly start an animated clock;

		//start countdown modal > run timer
		countdown(10, timer(game.timer));	
	}else if(!player.draw && !player.spectate){
		//if player and not spectator
		countdown(10, timer(game.timer));	
	}else if(player.spectate && !player.draw){
		//if just spectator
		countdown(10, timer(game.timer));	
	}
}

//spectate and non-drawer countdown
socket.on('gameBegun', (answer) => {
	game.cardAn = answer;
	beginGame(answer);
})

showDrawingTools  = () => {
	//show content with class drawing
	if (player.draw){document.body.classList.add('drawing')};
}

let StrButton = document.getElementById('startGame');
StrButton.addEventListener('click', (e) =>{
	//emit player is getting ready to draw and get deck from server:
	socket.emit('setupGame', player.roomName);
	//call to server to receive deck
	getDeck(0,4);
});

//let client know game beginning soon:
socket.on('settingUpGame',(message)=>{
	//update to use modal
	console.log(message);
});

//receive deck after getDeck() call
socket.on('deckRecieved',(data) => {
		//store chosen deck
		game.deck = data;
		//if drawer choose answer, (optional:) and send answer to clients
		//create table from deck
		if(player.draw == true){
			//choose card from deck
			chooseCard(0,game.deck.length - 1);
		}else if(player.draw == false && player.spectate == false){
			//if not drawer, create table from cards
			//create table to display options
			createTable(game.deck);
		}
});

let NGButton = document.getElementById('newGameBtn');
NGButton.addEventListener('click', (e) =>{
	let roomName = document.getElementsByName('bunk')[0].value;
	let playerName = document.getElementsByName('username')[0].value;
	player.name = playerName;
	socket.emit('createRoom',roomName);
});

let JRButton = document.getElementById('joinGameBtn');
JRButton.addEventListener('click', (e) =>{
	let roomName = document.getElementsByName('gameId')[0].value;
	let playerName = document.getElementsByName('username')[0].value;
	player.name = playerName;
	socket.emit('joinRoom',roomName);
});

socket.on('roomJoined',(msg) => {
	player.id = msg.id;
	document.getElementById('gameId').innerHTML = `${msg.roomName}`;
});

socket.on('roomCreated',(msg) => {
	player.id = msg.id;
	player.roomName = msg.roomName;
    console.log(canvas.height, canvas.width);
	document.getElementById('gameId').innerHTML = `${msg.roomName}`;
	//temp place setting draw to true in this function:
	player.draw = true;
	player.currentDrawer = true;
	//run function that displays start button:
	showDrawingTools();
});

socket.on('chooseAnotherRoom',()=>{
	//fire modal that allows client to emit joinRoom
});

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


// //global object setup (from chat-feature-branch)
// (function(){

//     var startGame = function(){
//         $('.intro').fadeOut(250, function(){
//             $('.stage').fadeIn(250);
//         });
//         if (PIC.user.joinGame.length > 0){
//             // do something to find that game
//         } else {
//             // do stuff to start new game
//         }
//     }

//     let PIC = {
//         user: {},
//         game: {
//             "startGame": startGame
//         }
//     }

//     return PIC;
// }()); 
