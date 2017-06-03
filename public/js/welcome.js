(function(){
    var intro         = $('.intro'),
        usernameInput = $('.intro input[name="username"]'),
        joinInput     = $('.intro input[name="gameId"]');

    function getUserData(){
        var button    = $(this),
            username  = usernameInput.val().trim(),
            gameID    = joinInput.val().trim(),
            enterGame = false;

        if (username.length === 0){
            alert('Please create a username!');
        } else if (button.hasClass('join-game')){
            if (gameID.length === 0) {
                joinInput.focus();
                alert('Provide Game ID to join a game!');
            } else {
                enterGame = true;
            }
        } else {
            enterGame = true;
        }

        PIC.user.username = username;
        PIC.user.joinGame = gameID;

        if (enterGame) { PIC.func.startGame(); }
    }

    intro.on('click','button', getUserData);

}());
