(function() {
    'use strict'
    // == variables
    let   chatColumn = document.getElementById('chatColumn'),
            chatForm = chatColumn.querySelector('form'),
            message = chatForm.querySelector('[name="chatInput"]'),
            welcomeMessage = null; // not yet created
    PIC.messageColumn = chatColumn.querySelector('.messages');       

    // == function lib
    let submitChat=(e)=>{
        e.preventDefault();
        let name = PIC.user.username,
            msg = message.value,
            currentChat = '';
        if (msg.length < 1) return; // stop if no message

        // show message in chat and clear fields
        printMessage({ "username": name, "userMessage": msg });
        message.value = '';
        message.focus();

        // send server username, message, and copy of current chat
        currentChat = PIC.messageColumn.innerHTML;
        socket.emit('chatUpdate', { "username": name, "userMessage": msg, "currentChat": currentChat, 'player': PIC.playerPayload });
    }

    let printMessage=(obj)=>{
        PIC.messageColumn.innerHTML += '<p><span class="username">' + obj.username + ': </span><span class="user-message">' + obj.userMessage + '</span></p>';
        moveChatUp();
    }

    let moveChatUp=()=>{
        welcomeMessage = PIC.messageColumn.querySelector('.chatWelcome');
        let contentHeight = Array
                .from(PIC.messageColumn.querySelectorAll('p'))
                .reduce(function(total, el) {
                    return total + el.clientHeight;
                }, 0);
        if (contentHeight <= PIC.messageColumn.clientHeight) {
            welcomeMessage.style.marginTop = (PIC.messageColumn.clientHeight - contentHeight) + 'px';
        } else {
            welcomeMessage.style.marginTop = '0px';
            PIC.messageColumn.scrollTop = PIC.messageColumn.scrollHeight;
        }

    }

    // == event listeners
    chatForm.addEventListener('submit', submitChat);
    chatForm.addEventListener('onsubmit', submitChat);
    message.addEventListener('keyup', (e) => {
        if (e.keyCode == 13) { submitChat(e) } });
    socket.on('chatUpdate', (data)=>{ printMessage(data); });

    // == setup
    if (welcomeMessage === null) {
        PIC.messageColumn.innerHTML += '<p class="chatWelcome">Welcome!</p>';
        moveChatUp();
    }

    // return PIC.chat = {
    //     "addMessage": printMessage
    // }
}());
