'use strict'
// == variables
//on connection create player from class constructor
class player{
	constructor(){
		this.name = name;
		this.number = number;
		this.guess = "";
		this.score = 0;
		this.hasDrawn = false;
		this.draw = false;
	}
}
const table = document.getElementById('guessWrapper');
const game = {
				score : 0,
				totalPlayers: 0,
				readyPlayers: 0,
				cardAn: '',
				deck : ''
			}

let tableString = "";
let deck;
let createTable;
let chooseCard;
let getDeck;
let card;

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
  card = deck[Math.floor(Math.random() * (max - min)) + min];
}

// select deck from server
getDeck = (min,max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  deckNumber = Math.floor(Math.random() * (max - min)) + min;
  socket.emit('getDeck',deckNumber);
}
socket.on('receiveDeck',(data) => {
		deck = data;
		createTable(deck);
	}
)

//select random card to be drawn



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



//


// == mock server inputs
function setDrawer(){
    player.draw = true;
    console.log('you may draw now');
}

setDrawer();
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


