var CatchPhrase = require('../models/catchphrase');
var PasswordGameHelper = {
    doIgnore : function() {

    },

    sendAWord : function(nsp, game) {
        game.passTurn();
        nsp.in(game.roomId).emit('updatechat', "SERVER","ROUND "+game.Round["currentRound"]+" COMPLETED");
        CatchPhrase.findOne({ 'word': 'India' }, function(err, cp) {
            game.resetCurrentPoints();
            game.resetInnerCurrentTurn();
            nsp.in(game.roomId).emit('updatechat', "SERVER","TURN TO : " +game.getInnerCurrentTurnTeam());
            nsp.sockets[game.getPlayerObj(game.Round["currentTurn"][0]).socketId].emit('updatechat', "SERVER", "Your word is :" + cp.word);
            nsp.sockets[game.getPlayerObj(game.Round["currentTurn"][1]).socketId].emit('updatechat', "SERVER", "Your word is :" + cp.word);
            
        });
    },

    verifyAnswer : function(nsp, game,gameStateMachine, userId, chatdata) {
        CatchPhrase.findOne({ 'word': chatdata }, function(err, cp) {
            if(cp) {
                nsp.in(game.roomId).emit('updatechat', "SERVER","CORRECT");
                game.addPoints();
                //this.updatePoints(nsp, game, gameStateMachine, userId, chatdata);
                nsp.in(game.roomId).emit('teamAPoints', game.Round["TEAMAPOINTS"]);
                nsp.in(game.roomId).emit('teamBPoints', game.Round["TEAMBPOINTS"]);
                game.Round["isAnswerCorrect"] = true;
                gameStateMachine.timerFunction();
                //if(gameStateMachine.getTimeLeft() > 0) {
                    //console.log("remaining time left: "+gameStateMachine.getTimeLeft() );
                    //PasswordGameHelper.sendAWord(nsp, game);
                //}
            } else {
                nsp.in(game.roomId).emit('updatechat', "SERVER","INCORRECT");
                gameStateMachine.timerFunction();
                // game.passInnerCurrentTurn();
                // if(game.Round["currentPoints"] == 0){
                    
                //     PasswordGameHelper.sendAWord(nsp, game);
                // }else
                //     nsp.in(game.roomId).emit('updatechat', "SERVER","TURN CHANGED TO : " +game.getInnerCurrentTurnTeam());
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
    },

    updatePoints : function(nsp, game, gameStateMachine, userId, chatdata){
        nsp.in(game.roomId).emit('teamAPoints', game.Round["TEAMAPOINTS"]);
        nsp.in(game.roomId).emit('teamBPoints', game.Round["TEAMBPOINTS"]);
    }
}

module.exports = exports = PasswordGameHelper;