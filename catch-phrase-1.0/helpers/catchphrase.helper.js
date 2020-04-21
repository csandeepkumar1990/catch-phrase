var CatchPhrase = require('../models/catchphrase');
var CatchphraseGameHelper = {
    doIgnore : function() {

    },

    sendAWord : function(nsp, game) {
        console.log("GAME" + game);
        game.passTurn();
        console.log("inside send a word : "+game.getCurrentTurnTeam());
        CatchPhrase.findOne({ 'word': 'India' }, function(err, cp) {
            nsp.sockets[game.getCurrentTurnPlayerObj().socketId].emit('updatechat', "SERVER", "Your word is :" + cp.word);
        });
    },

    verifyAnswer : function(nsp, game,gameStateMachine, userId, chatdata) {
        CatchPhrase.findOne({ 'word': chatdata }, function(err, cp) {
            if(cp) {
                nsp.in(game.roomId).emit('updatechat', "SERVER","CORRECT");
                if(gameStateMachine.getTimeLeft() > 0) {
                    console.log("remaining time left: "+gameStateMachine.getTimeLeft() );
                    CatchphraseGameHelper.sendAWord(nsp, game);
                }
            } else {
                nsp.in(game.roomId).emit('updatechat', "SERVER","INCORRECT");
            }
            
        });
    },

    doValidate : function(nsp, game, gameStateMachine, userId, chatdata) {
        //Ignore
        if(game.isaHint(game.getTeamId(userId))) {
            this.doIgnore();
        } else { //Validate
            this.verifyAnswer(nsp, game, gameStateMachine, userId, chatdata);
        }
    }
}

module.exports = exports = CatchphraseGameHelper;