'use strict'
// == variables
const chatColumn = document.getElementById('chatColumn');
const messageColumn = chatColumn.querySelector('.messages');
const chatForm = chatColumn.querySelector('form');
const username = chatForm.querySelector('[name="username"]');
const message = chatForm.querySelector('[name="chatInput"]');
let welcomeMessage = null; // not yet created

// == event listeners
chatForm.addEventListener('submit', submitChat);
chatForm.addEventListener('onsubmit', submitChat);
socket.on('chatUpdate', function(data){printMessage(JSON.parse(data))});

// == setup
moveChatUp();

// function lib
function submitChat(e){
    e.preventDefault();
    let name = username.value || 'Anonymous';
    let msg = message.value;
    if (msg.length < 1) return; // stop if no message
    printMessage({"username":name, "userMessage":msg});
    message.value = '';
    message.focus();

    // send to socket.io !!!!
    socket.emit('chatUpdate',JSON.stringify({"username":name, "userMessage":msg}));
}

function printMessage(obj){
    messageColumn.innerHTML += `<p><span class="username">${obj.username}: </span><span class="user-message">${obj.userMessage}</span></p>`;
    moveChatUp();
}

// chat moved up by measuring height of content area, and height of actual content
// then areaHeight - contentHeight = marginTop of welcome message, which pulls other content up with it
function moveChatUp(){
    if (welcomeMessage === null) messageColumn.innerHTML += `<p class="chatWelcome">Welcome!</p>`;
    welcomeMessage = messageColumn.querySelector('.chatWelcome');
    const contentHeight = Array
        .from(messageColumn.querySelectorAll('p'))
        .reduce(function(total, el){
            return total + el.clientHeight;
        },0);
    welcomeMessage.style.marginTop = (messageColumn.clientHeight - contentHeight)+'px';
}

// == misc
// chat dialog height matches height of canvas
messageColumn.height = canvas.offsetInnerHeight;
