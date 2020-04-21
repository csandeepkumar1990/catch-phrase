var SocketTimer = require("../utils/socket.timer");
var CatchPhrase = require('../models/catchphrase');
var PasswordGameHelper = require("../helpers/password.helper");

var PasswordGameStateMachine = function(game, nsp) { 
    
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
        game.passInnerCurrentTurn();
        if(game.Round["currentPoints"] == 0 || game.Round["isAnswerCorrect"]){
            game.Round["isAnswerCorrect"] = false;
            this.changeRound();
            if(game.isMaxRoundsCompleted()) {
                this.timer.stop();
                this.SocketEventHandler.sendMessageInRoom(game.roomId, "****** GAME OVER *****");
                return;
            }
            PasswordGameHelper.sendAWord(nsp,game);
            
        }
        else
        this.SocketEventHandler.sendMessageInRoom(game.roomId, "TURN CHANGED TO : " +game.getInnerCurrentTurnTeam());
        
    }

    this.changeRound = function() {
        //if(game.isRoundCompleted()) {
            game.Round.currentRound = game.Round.currentRound +1;
            console.log("GAME ROUND : "+game.Round.currentRound);
        //}
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
         
        this.timer.stop();
        this.changeTurn();
        if(game.isMaxRoundsCompleted()) {
            return;
        }
        //this.changeRound();
        this.startTimer();
    }

    this.startTimer = function() {
        this.timer = new SocketTimer(this.timerFunction.bind(this), 30000);
        this.timer.start();
    }

    this.stopTimer = function() {
        clearTimeout(this.timer);
    }

    this.getTimeLeft = function(){
        return this.timer.getTimeLeft();
    }

    this.restartTimer = function(){
        this.timer.stop();
        this.startTimer();
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

module.exports = exports = PasswordGameStateMachine;