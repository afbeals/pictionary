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
	}

	score () {
		return `${this.name} currently has a score of ${this.score}`;
    }
	
	guess () {
		return `${this.name} guessed ${this.guess}`;
    }

}
const table = document.getElementById('guessWrapper');
const game = {
				score : 0,
				//totalPlayers: 0,
				//readyPlayers: 0,
				players : [],
				cardAn: '',
				deck : ''
			}

let tableString = "";
let createTable;
let chooseCard;
let getDeck;

// == card functionality
// build out front end table based on chosen deck
createTable = (cards) => {
	cards.forEach((e, i) => {
	    tableString +=`<div class="cardWrapper"><div class="card">${e}</div></div>`
	});
	table.innerHTML = tableString;
} 

chooseCard = (min,max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  game.cardAn = game.deck[Math.floor(Math.random() * (max - min)) + min];
}

// select deck from server
getDeck = (min,max,callback) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  deckNumber = Math.floor(Math.random() * (max - min)) + min;
  socket.emit('getDeck',deckNumber);
}
timer = (startTime) => {
	//countdown timer set
	setInterval({},1000)
}
//start timer and show cardAn to player
beginGame = (answer) => {
	//show answer to player


}


//select random card to be drawn


/*
// = player interactions
//sever emit once a player joins to increase game.players
socket.emit('setup', () => {
	game.totalPlayers++;
});

//select player
//recieve information that client is drawer
const startButton = document.getElementById('startGame');
startButton.addEventListener('click', (e) => {
	game.readyPlayers++;
	//run function that disables start button
	this.classList.add("disabled");
	//once players ready match total players start the game
	if(game.readyPlayers == game.totalPlayers){
		//select player
		socket.emit('startGame');
	}
	
});
//!update username after createing instantiate of player function
socket.on('playerSelected',(gameInfo) => {
	if(gameInfo.playerNumber == 'username'.number){
		'username'.draw = true;
//update to an alert or use modal
		console.log('username'.name + " is the drawer! Begin when you'd like!");
//update max to final number of total amount of decks available
		deck = gameInfo.deck;
		getDeck(0,4);
		chooseCard(0,getDeck.length - 1);
	}
});
*/


//


// == mock server inputs
function setDrawer(){
    player.draw = true;
    console.log('you may draw now');
}

//setDrawer();
let cards = ['box','dress','karina'];
createTable(cards);
const cardSelected = document.getElementsByClassName('card');

for(let x = 0;x<cardSelected.length;++x){
	cardSelected[x].addEventListener('click', (e) => {
		//fire modal , mark as possible, mark as eliminated, mark as final

		//possible > change bg to yellow

		//elim > change bg to red, opacity lower

		//final > change to green, mark all others as elim, set player guess to this card
	});
}

socket.on('selectRoom', ()=>{
	//fire modal

});

//simu
let button = document.getElementById('startGame');
button.addEventListener('click', (e) =>{
	let roomName = document.getElementById('createRoom').value;
	console.log('ran')
	socket.emit('createRoom',roomName);

})
socket.on('messageName',(message)=>{
	console.log(message);
})
//

/*
let StrButton = document.getElementById('startButton');
StrButton.addEventListener('click', (e) =>{
	//emit player is getting ready to draw and get deck from server:
	socket.emit('setupGame');
	//call to server to receive deck
	getDeck(0,4);
});
//receive deck after getDeck() call
socket.on('deckRecieved',(data) => {
		//store chosen deck
		game.deck = data;
		//create table from deck
		createTable(game.deck);
		//choose card from deck
		chooseCard(0,game.deck.length - 1);
});

let CRButton = document.getElementById('createButton');
CRButton.addEventListener('click', (e) =>{
	let roomName = document.getElementById('createRoom').value;
	let playerName = document.getElementById('playerName').value;
	const player = new Player();
	player.name = playerName;
	player.roomName = roomName;
	socket.emit('createRoom',roomName);
});

let JRButton = document.getElementById('joinButton');
JRButton.addEventListener('click', (e) =>{
	let roomName = document.getElementById('joinRoom').value;
	let playerName = document.getElementById('playerName').value;
	const player = new Player();
	player.name = playerName;
	player.roomName = roomName;
	socket.emit('joinRoom',roomName);
});
*/
socket.on('roomJoined',(msg) => {
	player.id = msg.id;
	console.log(msg.roomName,' joined');
});

socket.on('roomCreated',(msg) => {
	player.id = msg.id;
	console.log(msg.roomName,' created');
});

socket.on('messge',(msg)=>{console.log('weop: ',msg)})