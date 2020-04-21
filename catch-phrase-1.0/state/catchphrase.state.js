var SocketTimer = require("../utils/socket.timer");
var CatchPhrase = require('../models/catchphrase');

var CatchphraseGameStateMachine = function(game, nsp) { 
    
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
        this.SocketEventHandler.sendMessageInRoom(game.roomId, "Congratulations "+game.getCurrentTurnTeam() +" Won.");
        this.SocketEventHandler.sendMessageInRoom(game.roomId, "Turn changed to "+game.getCurrentTurnPlayerObj().username);
        CatchPhrase.findOne({ 'word': 'India' }, function(err, cp) {
            nsp.sockets[game.getCurrentTurnPlayerObj().socketId].emit('updatechat', "SERVER", "Your word is :" + cp.word);
        });
    }

    this.changeRound = function() {
        //if(game.isRoundCompleted()) {
            game.Round.currentRound = game.Round.currentRound +1;
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
        if(game.isMaxRoundsCompleted()) {
            this.timer.stop();
            this.SocketEventHandler.sendMessageInRoom(game.roomId, "****** GAME OVER *****");
            return;
        } 
        this.timer.stop();
        this.changeTurn();
        this.changeRound();
        this.startTimer();
    }

    this.startTimer = function() {
        this.timer = new SocketTimer(this.timerFunction.bind(this), this.getTimer());
        this.timer.start();
    }

    this.stopTimer = function() {
        clearTimeout(this.timer);
    }

    this.getTimeLeft = function(){
        return this.timer.getTimeLeft();
    }

    this.getTimer = function(){
        if(game.Round.currentRound == 0)
            return this.randomNumberGenerator(75000,90000);
        if(game.Round.currentRound == 1)
                return this.randomNumberGenerator(60000,75000);
            else
                return this.randomNumberGenerator(45000,60000);
    }

    this.randomNumberGenerator = function(start, end){
        console.log("start" + start+" : "+end);
        var a = Math.floor((Math.random() * (end-start))+start);
        console.log("RANDOM NUMBER : " +a);
        console.log("ROUND : " +game.Round.currentRound);
        return a;
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

module.exports = exports = CatchphraseGameStateMachine;