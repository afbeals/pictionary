'use strict'
// == variables
const deckTable = document.getElementById('guessWrapper');
const player = {
				number : -1,
				name : "",
				guess : "",
				score : 0,
				draw : false
			}
const game = {
				score : 12,
				deck : '',
				cards : ""
			}
let table = "";
let deck;
let cards;
let createTable;
let getDeck;

// == card functionality
// build out front end table based on chosen deck
createTable = (cards) => {
	cards.forEach((e, i) => {
	    table +=`<div class="cardWrapper"><div class="card">${e}</div></div>`
	});
	deckTable.innerHTML = table;
} 

// select deck from server
getDeck = (min,max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  deck = Math.floor(Math.random() * (max - min)) + min;
  socket.emit('getDeck',deck);
}
socket.on('receiveDeck',(deck) => {
		cards = deck;
		createTable(cards);
	}
)

// == mock server inputs
function setDrawer(){
    player.draw = true;
    console.log('you may draw now');
}

setDrawer();
cards = ['box','dress','karina'];
createTable(cards);
