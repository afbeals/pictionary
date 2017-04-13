(function(){
    'use strict'
    // == variables
    var chatColumn = document.getElementById('chatColumn');
    var messageColumn = chatColumn.querySelector('.messages');
    var chatForm = chatColumn.querySelector('form');
    var message = chatForm.querySelector('[name="chatInput"]');
    var welcomeMessage = null; // not yet created

    // == event listeners
    chatForm.addEventListener('submit', submitChat);
    chatForm.addEventListener('onsubmit', submitChat);
    socket.on('chatUpdate', function(data){ printMessage(data); });
    socket.on('setup', function(data){ printHistory(data); });

    // == setup
    if (welcomeMessage === null) {
        messageColumn.innerHTML += '<p class="chatWelcome">Welcome!</p>';
        moveChatUp();
    }

    // function lib
    function submitChat(e){
        e.preventDefault();
        var name = PIC.user.username;
        var msg = message.value;
        var currentChat = '';
        if (msg.length < 1) return; // stop if no message

        // show message in chat and clear fields
        printMessage({"username":name, "userMessage":msg});
        message.value = '';
        message.focus();

        // send server username, message, and copy of current chat
        currentChat = messageColumn.innerHTML;
        socket.emit('chatUpdate',{"username":name, "userMessage":msg, "currentChat":currentChat});
    }

    function printMessage(obj){
        messageColumn.innerHTML += '<p><span class="username">' + obj.username + ': </span><span class="user-message">' + obj.userMessage + '</span></p>';
        moveChatUp();
    }

    function moveChatUp(){
        welcomeMessage = messageColumn.querySelector('.chatWelcome');
        var contentHeight = Array
            .from(messageColumn.querySelectorAll('p'))
            .reduce(function(total, el){
                return total + el.clientHeight;
            },0);
        if (contentHeight <= messageColumn.clientHeight) {
            welcomeMessage.style.marginTop = (messageColumn.clientHeight - contentHeight)+'px';
        } else {
            welcomeMessage.style.marginTop = '0px';
            messageColumn.scrollTop = messageColumn.scrollHeight;
        }

    }

    function printHistory(data){
        if (data.chatHistory.length > 0){
            messageColumn.innerHTML = data.chatHistory;
        }
    }

    return PIC.chat = {
        "addMessage": printMessage
    }

}());
