(function(){
    var chatColumn    = $('#chatColumn'),
        messageColumn = chatColumn.find('.messages'),
        chatForm      = chatColumn.find('form'),
        message       = chatForm.find('textarea[name="chatInput"]'),
        chatBtn       = chatForm.find('button'),
        marginHeight  = 2;





    var getUserMessage = function(){
        var text = message.val();
        text.length > 0 ? addMessage(text) : message.focus();
    }

    var addMessage = function(str){
        var user    = PIC.user.username,
            message = '<p><span class="username">' + user + ': </span><span class="user-message">' + str + '</span></p>',
            height = 0;
        messageColumn.append(message);

        height = $(message).height();
        adjustHeight(height);
    }

    var adjustHeight = function(num){
        var columnHeight  = messageColumn.height(),
            chatContent   = messageColumn.find('p'),
            firstChatItem = chatContent[0],
            marginTop     = 0;


        $(firstChatItem).css({ marginTop: firstMarinTop - num + 'px'})
    }

    chatBtn.on('click', getUserMessage);

    return PIC.chat = {
        "addMessage": addMessage
    }
}());
