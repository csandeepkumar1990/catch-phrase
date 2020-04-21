var CatchPhrase = require('../models/catchphrase');
var NinetysecGameHelper = {
    doIgnore : function() {

    },

    sendAWord : function(nsp, game) {
        CatchPhrase.findOne({ 'word': 'India' }, function(err, cp) {
            nsp.sockets[game.getCurrentTurnPlayerObj().socketId].emit('updatechat', "SERVER", "Your word is :" + cp.word);
        });
    },

    verifyAnswer : function(nsp, game,gameStateMachine, userId, chatdata) {
        CatchPhrase.findOne({ 'word': chatdata }, function(err, cp) {
            if(cp) {
                nsp.in(game.roomId).emit('updatechat', "SERVER","CORRECT");
                var teamId = game.getTeamId(userId);
                if(teamId.includes("TEAMA"))
                game.scoreBoard.METRICS.TEAMA_POINTS += 1;
                if(teamId.includes("TEAMB"))
                game.scoreBoard.METRICS.TEAMB_POINTS += 1;
               
                if(gameStateMachine.getTimeLeft() > 0) {
                    console.log("remaining time left: "+gameStateMachine.getTimeLeft() );
                    NinetysecGameHelper.sendAWord(nsp, game);
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

module.exports = exports = NinetysecGameHelper;