// global object setup
(function(){

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


    return PIC = {
        user: {},
        game: {
            "startGame": startGame
        }
    }
}());
