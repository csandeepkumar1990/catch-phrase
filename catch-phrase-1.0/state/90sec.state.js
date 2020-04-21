var SocketTimer = require("../utils/socket.timer");
var CatchPhrase = require('../models/catchphrase');

var NinetysecGameStateMachine = function(game, nsp) { 
    
    this.arena = 'arena';
    this.game = game;
    this.nsp = nsp;

    this.startGame = function() {
        this.SocketEventHandler.sendMessageInRoom(game.roomId, "LOADING YOUR GAME");
        this.startTimer();
        
    }

    this.stopGame = function() {

    }

    this.changeTurn = function() {
        game.passTurn();
        this.SocketEventHandler.sendMessageInRoom(game.roomId, "Turn changed to "+game.getCurrentTurnPlayerObj().username);
        CatchPhrase.findOne({ 'word': 'India' }, function(err, cp) {
            if(nsp.sockets[game.getCurrentTurnPlayerObj().socketId])
            nsp.sockets[game.getCurrentTurnPlayerObj().socketId].emit('updatechat', "SERVER", "Your word is :" + cp.word);
        });
    }

    this.changeRound = function() {
        if(game.isRoundCompleted()) {
            game.Round.currentRound = game.Round.currentRound +1;
        }
    }

    this.onChatMsg = function() {
        
    }

    

    this.isRoomfull = function() {
        if(numOfPlayersJoined() == game.MAX_PLAYERS) {
            return true;
        }
        return false;
    }

    this.timerFunction = function() {
        if(game.isMaxRoundsCompleted()) {
            this.timer.stop();
            this.SocketEventHandler.sendMessageInRoom(game.roomId, "****** GAME OVER *****");
            if(game.scoreBoard.METRICS.TEAMA_POINTS > game.scoreBoard.METRICS.TEAMB_POINTS) {
                this.SocketEventHandler.sendMessageInRoom(game.roomId, "****** PLAYER A WINS *****");
            } else if(game.scoreBoard.METRICS.TEAMA_POINTS < game.scoreBoard.METRICS.TEAMB_POINTS) {
                this.SocketEventHandler.sendMessageInRoom(game.roomId, "****** PLAYER B WINS *****");
            } else {
                this.SocketEventHandler.sendMessageInRoom(game.roomId, "****** MATCH DRAWN *****");
            }
            return;
        } 
        this.timer.stop();
        this.changeTurn();
        this.changeRound();
        this.startTimer();
    }

    this.startTimer = function() {
        this.timer = new SocketTimer(this.timerFunction.bind(this), 90000);
        this.timer.start();
    }

    this.stopTimer = function() {
        clearTimeout(this.timer);
    }

    this.getTimeLeft = function(){
        return this.timer.getTimeLeft();
    }

    this.addTime = function(){
        console.log(this.timer.getTimeLeft());
        this.timer.addTime(15000)
        console.log(this.timer.getTimeLeft());
    }

    this.SocketEventHandler = { 

        emitMessageToUserInNsp: function(msg) {

        },

        broadcastMessageToNsp: function(msg) {

        },

        sendMessageInRoom: function(roomId, message) {
            nsp.in(roomId).emit('updatechat', "SERVER",message);    
        },
        
        sendPrivateMessage: function(socketId, message){
            nsp.sockets[socketId].emit('updatechat', "SERVER", message);
        }
    }

    numOfPlayersJoined = function(){
        var num = 0;
        if(game.teams["TEAMA"]["PLAYER1"].userId) {
            num = num +1;
        }

        if(game.teams["TEAMB"]["PLAYER1"].userId) {
            num = num +1;
        }
        console.log("numOfPlayersJoined" +num)
        return num;
    }

};

module.exports = exports = NinetysecGameStateMachine;