'use strict'
 //=====Classes=====//
//=================//
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
		//this.currentDrawer = false;
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

 //=====Game Obj=====//
//==================//
const PIC = {
	// consistent DOM elements
	JRButton : document.getElementById('joinGameBtn'),
	NGButton : document.getElementById('newGameBtn'),
	preGameLobby : document.getElementById('gameLobby'),
	readyBtn : document.getElementById('readyButton'),
	spectatingBtn : document.getElementById('spectateButton'),
	StrButton : document.getElementById('startGame'),
	table : document.getElementById('table'),
	//game constants
	tableString : "",
	groupScore : [],
    player: {},
    playerPayload: {},
    game: {
    	playersList : [],
		hasntDrawn : [],
		cardAn: '',
		timer: 10,
		deck : ''
    },
    game2:{

    },
    user: {

    },
    //initialize socket receivers
	initializeRec: ()=>{
		let picReceivers = PIC.sockets.receivers;
		for(let func in picReceivers){
			picReceivers[func]();
		}
	},
	//socket func
    sockets:{
    	emits:{
	    	beginGame : (cardAn, roomName) =>{
				socket.emit('beginGame',{cardAn: cardAn, roomName: roomName});
			},
			createRoom : (name, roomName) =>{
				socket.emit('createRoom',{'roomName':roomName,'playerName':name});
			},
			gameCountDown : (playerPayload) =>{
				socket.emit('gameCountDown', playerPayload);
				PIC.func.createCanvas();
			},
			getDeck : (deckNumber,roomName) => {
				socket.emit('getDeck',{deckNumber: deckNumber,roomName: roomName});
			},
			getScore : (curId,pID)=>{
				socket.emit('getScore',{playerId:curId,leader:pID});
			},
			joinRoom : (playerPayload)=>{
				socket.emit('joinRoom',playerPayload);
			},
			openCanvas : (playerPayload)=>{
				socket.emit('openCanvas',playerPayload);
			},
			playerReadyToPlay : (playerPayload)=>{
				socket.emit('playerReadyToPlay', playerPayload);
			},
			playerReadyToSpectate : (playerPayload)=>{
				socket.emit('playerReadyToSpectate', playerPayload);
			},
			restartGame:(playerPayload)=>{
				socket.emit('restartGame',playerPayload);
			},
			selectedNewPlayer : (player)=>{
				socket.emit('selectedNewPlayer',player);
			},
			sendListOfPlayers : (list,room,id,chatHistory)=>{
				socket.emit('sendListOfPlayers',{list: list, room: room, id: id, chatHistory: chatHistory});
			},
			sendScore : (leader,score,player)=>{
				socket.emit('sendScore',{leader:leader,score:score,player:player});
			},
			setRestartLeader : (player)=>{
				socket.emit('setRestartLeader',player);
			},
			startNextRound : (playerPayload)=>{
				socket.emit('startNextRound',playerPayload);
			},
			updateAllScores : (groupScores,roomName)=>{
				socket.emit('updateAllScores',{groupScores:groupScores,roomName:roomName});
			},
			updateDrawerList : (playerPayload)=>{
				socket.emit('updateDrawerList',playerPayload);
			},
    	},

    	receivers:{
    		assignID : ()=>{
    			socket.on('assignID', (id) => PIC.playerPayload.id = id);
    		},
    		beginCountDown : ()=>{
    			socket.on('beginCountDown',()=> {PIC.func.beginCountDown()});
    		},
    		deckRecieved : ()=>{
    			socket.on('deckRecieved',(data) => {
					PIC.game.deck = data;
					if(PIC.player.draw == true){
						PIC.func.chooseCard(0,PIC.game.deck.length - 1);
					}
				});
    		},
    		getExistingPlayers : ()=>{
    			socket.on('getExistingPlayers', (obj) => {
					PIC.func.overWritePlayersList(obj.list);
					PIC.func.drawGameLobby();
					PIC.messageColumn.innerHTML = obj.currentChat;
				});
    		},
    		gameBegun : ()=>{
    			socket.on('gameBegun', (answer) => {
					PIC.game.cardAn = answer;
					PIC.func.beginGame(answer);
				})
    		},
    		getScore : ()=>{
    			socket.on('getScore',(data)=>{
					PIC.sockets.emits.sendScore(data.leader,PIC.player.score,PIC.playerPayload);
				});
    		},
    		nextRoundStarted : ()=>{
    			socket.on('nextRoundStarted',()=>{
					PIC.func.beginNextRound();
				})
    		},
    		newPlayerJoinedRoom : ()=>{
    			socket.on('newPlayerJoinedRoom', (obj) => {
					PIC.func.addToPlayerList(obj);
					PIC.func.drawGameLobby();
					if (PIC.player.leader){
						PIC.sockets.emits.sendListOfPlayers(PIC.game.playersList,obj.roomName,obj.id, PIC.messageColumn.innerHTML);
					}
				});
    		},
    		openCanvas : () =>{
    			socket.on('openCanvas',()=>{
	    			if(!PIC.player.spectate){
						PIC.player.draw=true;
						//player.currentDrawer=true;
						window.canvas = document.querySelector('#canvas');
					    var ctx = canvas.getContext('2d');
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						$('#screen').fadeOut(250);
					}	
    			})
    		},
    		playerIsReady : () =>{
    			socket.on('playerIsReady', (obj) => PIC.func.playerReady(event, obj.id));
    		},
    		playerIsSpectating : () =>{
    			socket.on('playerIsSpectating', (obj) => PIC.func.playerSpectating(event, obj.id));
    		},
    		restartGame : ()=>{
    			console.log('restart');
    			socket.on('restartGame',()=>{
    				
	    			if(!PIC.player.spectate){
	    				console.log('avea');
						PIC.player.guess="";
						PIC.player.score=0;
						PIC.player.hasDrawn=false;
						PIC.player.draw=false;
						PIC.player.leader=false;
						PIC.game.hasntDrawn = PIC.game.playersList;
						PIC.game.cardAn='';
						PIC.game.deck='';
						let min = Math.ceil(0);
					  	let max = Math.floor(PIC.game.hasntDrawn.length);
					  	let playerInArray = PIC.game.hasntDrawn[Math.floor(Math.random() * (max - min)) + min];
					  	console.log(playerInArray);
					  	PIC.sockets.emits.setRestartLeader(playerInArray);
					}
				});
    		},
    		roomCreated : () =>{
    			socket.on('roomCreated',(msg) => {
					PIC.func.createPlayer(msg.username, msg.roomName, PIC.playerPayload.id);
					document.getElementById('gameId').innerHTML = `${msg.roomName}`;
					PIC.player.draw = true;
					PIC.player.leader = true;
					document.body.classList.add('roomLeader')
					PIC.func.showDrawingTools();
					PIC.func.addToPlayerList(PIC.playerPayload);
					PIC.func.drawGameLobby();
				});
    		},
    		selectedPlayers : ()=>{
    			socket.on('selectedPlayer',()=>{
					PIC.player.leader = true;
					PIC.player.draw = true;
					document.querySelector('#screen .content').innerHTML = `<button id="nextRound" onclick="PIC.func.startNextRound()">next Round</button>`;
				});
    		},
    		scoreSent : ()=>{
    			socket.on('scoreSent',(data)=>{
					PIC.groupScores.push({playerId:data.player.id,playerScore:data.score,playerName:data.player.name});
					if(PIC.groupScores.length == (PIC.game.playersList.length-1)){
						PIC.groupScores.push({playerId:PIC.player.id,playerScore:PIC.player.score,playerName:PIC.player.name})
						PIC.sockets.emits.updateAllScores(PIC.groupScores,PIC.player.roomName);
					}
				})
    		},

    		userDC : ()=>{
    			socket.on('userDC',(user)=>{
					PIC.func.removePlayerFromList(PIC.game.playersList,user.userId);
					PIC.func.removePlayerFromList(PIC.game.hasntDrawn,user.userId);
					PIC.func.drawGameLobby();
				});
    		},

    		updateAllGameLobbies : ()=>{
    			socket.on('updateAllGameLobbies', (array) => {
					PIC.func.overWritePlayersList(array);
					PIC.func.drawGameLobby();
				});
    		},

    		updateAllScores : ()=>{
    			socket.on('updateAllScores',(data)=>{
					let playerDisplayString = '';
					data.scores.forEach((c,i,a)=>{
						playerDisplayString+=`${c.playerName} has <span class="showScore">${c.playerScore}</span> points!`;
					})
					document.getElementById('roundTimer').innerHTML = playerDisplayString;
				})
    		},
    		updateDrawerList : ()=>{
    			socket.on('updateDrawerList',(data)=>{
					PIC.func.removePlayerFromList(PIC.game.hasntDrawn,data.id);
				})
    		}
    	}	
	},
	//game methods
    func: {
        startGame: ()=>{
			$('.intro').fadeOut(250, function(){
			    $('.stage').fadeIn(250);
			});
			if (PIC.user.joinGame.length > 0){
			    // do something to find that game
			} else {
			    // do stuff to start new game
			}
		},

        addToPlayerList : (obj)=>{
        	PIC.game.hasntDrawn.push(obj);
			return PIC.game.playersList.push(obj);
        },

        chooseCard : (min,max) => {
			min = Math.ceil(min);
			max = Math.floor(max);
			PIC.game.cardAn = game.deck[Math.floor(Math.random() * (max - min)) + min];
			PIC.func.showAnswer(game.cardAn);
			PIC.sockets.emits.beginGame(PIC.game.cardAn,PIC.playerPayload.roomName);
		},

		createPlayer : (name,roomName,id) => {
		   PIC.playerPayload = new PlayerPayload(name,roomName,id);
		   PIC.player = new Player(name,roomName,id);
		},

		createTable : (cards) =>{
			PIC.tableString = ``;
			cards.forEach((e, i) => {
				
			    PIC.tableString +=`
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
			$(PIC.table).css('display','none').html(PIC.tableString).fadeIn(500); //.innerHTML = tableString;
		},

        // build out front end table based on chosen deck
        beginGame : (answer) => {
			if(PIC.player.draw){
				console.log("yaea'")
				PIC.func.countdown(6, PIC.func.timer(PIC.game.timer+6));
			}else if(!PIC.player.draw && !PIC.player.spectate){
				PIC.func.countdown(6, PIC.func.timer(PIC.game.timer+6));
			}else if(PIC.player.spectate && !PIC.player.draw){
				PIC.func.countdown(6, PIC.func.timer(PIC.game.timer+6));
			}
		},

		beginCountDown: ()=>{
			document.body.classList.add('pregame-countdown');
			$('.lobbyActionButtons').fadeOut(125, function(){
				$('.gameCountdown').hide().removeClass('hidden').fadeIn(125);
			});
			let el = document.querySelector('#screen .content .pregame-countdown .pregame-time');
			if(PIC.player.leader != true){
				let time = 10;
				el.innerText = time + ' seconds';
				let interval = setInterval(function(){
					--time;
					if (time > 1) {
						el.innerText = time + ' seconds';
					} else {
						if (time === 0) {
							clearInterval(interval);
							el.innerText = time + ' seconds';
							$('#screen').fadeOut(125);
							PIC.func.createTable(PIC.game.deck);
							PIC.func.createCanvas();
						} else {
							el.innerText = time + ' second';
						}
					}
				}, 1000)
			} else if(PIC.player.leader = true){
				let time = 4;
				el.innerText = time + ' seconds';
				let interval = setInterval(function(){
					--time;
					if (time > 1) {
						el.innerText = time + ' seconds';
					} else {
						if (time === 0) {
							clearInterval(interval);
							el.innerText = time + ' seconds';
							$('#screen').fadeOut(125);
							PIC.func.getDeck(0,4);
						} else {
							el.innerText = time + ' second';
						}
					}
				}, 1000)
			}	
		},

		beginNextRound : ()=>{
			let el = document.getElementById('countdownTimer');
			if(PIC.player.leader != true){
				let time = 10;
				let interval = setInterval(function(){
					--time;
					if (time > 1) {
						el.innerText = time + ' seconds';
					} else {
						if (time === 0) {
							clearInterval(interval);
							el.innerText = time + ' seconds';
							$('#screen').fadeOut(125);
							PIC.func.createTable(PIC.game.deck);
							PIC.func.createCanvas();
						} else {
							el.innerText = time + ' second';
						}
					}
				}, 1000)
			}else if(PIC.player.leader = true){
				let time = 4;
				el.innerText = time + ' seconds';
				let interval = setInterval(function(){
					--time;
					if (time > 1) {
						el.innerText = time + ' seconds';
					} else {
						if (time === 0) {
							clearInterval(interval);
							el.innerText = time + ' seconds';
							$('#screen').fadeOut(125);
							PIC.func.getDeck(0,4);
						} else {
							el.innerText = time + ' second';
						}
					}
				}, 1000)
			}
		},

		//choose card from current deck
		chooseCard : (min,max) => {
			min = Math.ceil(min);
			max = Math.floor(max);
			PIC.game.cardAn = PIC.game.deck[Math.floor(Math.random() * (max - min)) + min];
			PIC.func.showAnswer(PIC.game.cardAn);
			PIC.sockets.emits.beginGame(PIC.game.cardAn,PIC.playerPayload.roomName);
		},

		//countdown function to event
		countdown : (time,callback) => {
			let int = setInterval(()=>{
				--time;
				if(time<=0){
					document.getElementById('countdownTimer').innerHTML = `Go!!!`;
					clearInterval(int);
				}else{
					document.getElementById('countdownTimer').innerHTML = `${time} seconds left`;
				}
			},1000);
		},

		drawGameLobby : ()=>{
			PIC.preGameLobby.innerHTML = '';
			console.log(PIC.game.playersList);
			PIC.game.playersList.forEach(function(obj){
				console.log(obj);
				PIC.preGameLobby.innerHTML +=
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
		},

		//end game function
		endGame : ()=>{
			PIC.groupScores = [];
			if(PIC.game.cardAn.toLowerCase() == PIC.player.guess.toLowerCase()){
				PIC.player.score+=100;
			}else{
				//incorretGuess(); //<= show incorret guess actions
			}
			let cardSelected = document.querySelectorAll('.cardInner');
			for(let x = 0;x<cardSelected.length;++x){
				if(!cardSelected[x].classList.contains('selected')){
					cardSelected[x].classList.add('dis');
					cardSelected[x].classList.remove('active','caution');
					(cardSelected[x].classList.contains('flipped')) ? cardSelected[x].classList.remove('flipped') : null
				}
			};
			window.canvas = document.querySelector('#canvas');
		    let ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			$('#screen').fadeIn(250);
			$('.content').html('');
			if(PIC.player.leader == true){
				PIC.game.playersList.forEach((c,i,a)=>{
					if(c.id != PIC.player.id){
						PIC.sockets.emits.getScore(c.id,PIC.player.id);
					}
				});
			}
			PIC.sockets.receivers.getScore();
			PIC.sockets.receivers.scoreSent();
			PIC.sockets.receivers.updateAllScores();
			$(PIC.table).fadeOut(125);
			if(PIC.player.leader){
				$('.content').html('<button  onclick="PIC.func.restartGame()">Restart Game</button><button  onclick="PIC.func.openCanvas()">Open Canvas</button>');
			}else{
				$('.content').html('gameOver player scores:');
			}
		},

		// select deck from server
		getDeck : (min,max,callback) => {
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  let deckNumber = Math.floor(Math.random() * (max - min)) + min;
		  PIC.sockets.emits.getDeck(deckNumber,PIC.playerPayload.roomName);
		},

		nextRound : ()=>{
			PIC.groupScores = [];
			if(PIC.game.cardAn.toLowerCase() == PIC.player.guess.toLowerCase()){
				PIC.player.score+=100;
			}else{
				//incorretGuess(); //<= show incorret guess actions
			}
			let cardSelected = document.querySelectorAll('.cardInner');
			for(let x = 0;x<cardSelected.length;++x){
				if(!cardSelected[x].classList.contains('selected')){
					cardSelected[x].classList.add('dis');
					cardSelected[x].classList.remove('active','caution');
					(cardSelected[x].classList.contains('flipped')) ? cardSelected[x].classList.remove('flipped') : null
				}
			};
			window.canvas = document.querySelector('#canvas');
		    let ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			$('#screen').fadeIn(250);
			$('.content').html('');
			if(PIC.player.leader == true){
				PIC.game.playersList.forEach((c,i,a)=>{
					if(c.id != PIC.player.id){
						PIC.sockets.emits.getScore(c.id,PIC.player.id);
					}
				});
			}
			PIC.sockets.receivers.getScore();
			PIC.sockets.receivers.scoreSent();
			PIC.sockets.receivers.updateAllScores();
			$(PIC.table).fadeOut(125);
			if(PIC.player.leader){
				PIC.func.selectRandomPlayer();
			} 
		},

		openCanvas : () =>{
			PIC.sockets.emits.openCanvas(PIC.playerPayload);
		},

		overWritePlayersList : (array)=>{
			PIC.game.playersList = array;
			PIC.game.hasntDrawn = array;
		},

		playerSpectating : (event, id)=>{
			if (!id) { id = PIC.playerPayload.id; }
			let playerLi = PIC.preGameLobby.querySelector('[data-id="'+ id +'"]');
			playerLi.classList.remove('loading','readyToPlay');
			playerLi.classList.add('spectating');
			PIC.player.spectate = true;
		},

		playerReady : (event, id)=>{
			if (!id) { id = PIC.playerPayload.id; }
			let playerLi = PIC.preGameLobby.querySelector('[data-id="'+ id +'"]');
			playerLi.classList.remove('loading','spectating');
			playerLi.classList.add('readyToPlay');
		},

		removePlayerFromList: (arr,pId)=>{
			arr.forEach((c,i,a)=>{
				if(c.id == pId){
					arr.splice(i,1);
				}
			})
		},
		restartCanvas : ()=>{

		},

		restartGame : ()=>{
			PIC.sockets.emits.restartGame(PIC.playerPayload);
		},

		selectRandomPlayer: ()=>{
			PIC.func.removePlayerFromList(PIC.game.hasntDrawn,PIC.player.id);
			PIC.sockets.emits.updateDrawerList(PIC.playerPayload);
			let min = Math.ceil(0);
		  	let max = Math.floor(PIC.game.hasntDrawn.length);
		  	let playerInArray = PIC.game.hasntDrawn[Math.floor(Math.random() * (max - min)) + min]
		  	PIC.player.hasDrawn = true;
		  	PIC.player.draw = false;
		  	PIC.sockets.emits.selectedNewPlayer(playerInArray);
		  	PIC.player.leader = false;
		},

		//display current drawers card on table
		showAnswer : (ans) => {
			let answerString = 
				`<div class="answer">
					<div class="animate">
						<p class="step1">
							you're drawing...
						</p>
						<p class="step2">${ans}</p>
					</div>
					
					<div class="left">
			            <p>Drawing</p>
			        </div>
			        <div class="right">
			            <p>${ans}</p>
			        </div>
			    </div>`;
			PIC.table.style.display = "block";	    
			PIC.table.innerHTML = answerString;
		},

		showDrawingTools : () => {
			//show content with class drawing
			if (PIC.player.draw){document.body.classList.add('drawing')};
		},

		startNextRound : ()=>{
			PIC.sockets.emits.startNextRound(PIC.playerPayload);
		},

		//timer for event
		timer : (time) => {
			let int = setInterval(()=>{
				--time;
				if(time<=0){
					clearInterval(int);
					if(PIC.game.hasntDrawn.length <= 1){
						PIC.func.endGame();
					}else{
						PIC.func.nextRound();
					}
				}else if(time<=PIC.game.timer){
					document.getElementById('roundTimer').innerHTML = `${time}`;
				}
			},1000);
		},
    }
}



//initializers
PIC.StrButton.addEventListener('click', (e) =>{
	PIC.sockets.emits.gameCountDown(PIC.playerPayload);
});

PIC.NGButton.addEventListener('click', (e) =>{
	let roomName = document.getElementsByName('bunk')[0].value;
	let playerName = document.getElementsByName('username')[0].value;
	if(roomName.length > 1 && playerName.length > 1){
		PIC.sockets.emits.createRoom(playerName,roomName);	
	}
});

PIC.JRButton.addEventListener('click', (e) =>{
	let roomName = document.getElementsByName('gameId')[0].value;
	let playerName = document.getElementsByName('username')[0].value;
	if(roomName.length > 1 && playerName.length > 1){
		PIC.func.createPlayer(playerName, roomName, PIC.playerPayload.id);
		PIC.sockets.emits.joinRoom(PIC.playerPayload);
	}
});

PIC.readyBtn.addEventListener('click', () => {
	PIC.func.playerReady();
	PIC.sockets.emits.playerReadyToPlay(PIC.playerPayload);
	PIC.func.createCanvas();
});

PIC.spectatingBtn.addEventListener('click', () => {
	PIC.func.playerSpectating();
	PIC.sockets.emits.playerReadyToSpectate(PIC.playerPayload);
	PIC.func.createCanvas();
});

PIC.initializeRec();