var User = require('../models/user');
var Arena = require('../models/arena');
var CatchPhrase = require('../models/catchphrase');
var Player = require('../models/player');
var Rounds = require('../models/rounds');
var CatchPhraseGameObj = require("../game/catchphrase.game");
var CatchPhraseGameStateMachine = require("../state/catchphrase.state");
var CatchPhraseGames = {};
var CatchPhraseGameStateMachines = {};
var CatchPhraseGameHelper = require("../helpers/catchphrase.helper");
var MAX_PLAYERS = 4;

/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */

var ioEvents = function(_io) {

    _io.of('/catchphrase').on('connection', function(socket) {
        socket.on('joincatchphraseroom', function(userId, username, arenaId, title) {
            socket.username = username;
            var teamId;
            Arena.findOne({ 'title': title}, function(err, arena) {
                 arena.teams.forEach(function(element) {
                     if(element.userId === userId)
                     teamId = element.teamId.toUpperCase();

                     
                 });
                 var game = CatchPhraseGames[arenaId];
                 var gameStateMachine = CatchPhraseGameStateMachines[arenaId];
                     if(game) {
                         var playerNo = CatchphraseUtils.fetchPlayerNo(game, teamId);
                         //Room already created
                         game.teams[teamId][playerNo].userId = userId;
                         game.teams[teamId][playerNo].username = username;
                         game.teams[teamId][playerNo].socketId = socket.id;
                         
                         if(!socket.rooms[game.roomId]){
                             socket.join(game.roomId);
                             _io.of('/catchphrase').in(game.roomId).emit('updatechat', "SERVER", username + " has joined");
                             var clientsInRoom = _io.of(socket.nsp.name).adapter.rooms[game.roomId];
                             var numClients = clientsInRoom === undefined ? [] : Object.keys(clientsInRoom.sockets);
                             if(numClients.length === MAX_PLAYERS){
                                 _io.of('/catchphrase').in(game.roomId).emit('updatechat', "SERVER",  " START THE GAME");
                                 CatchPhrase.findOne({ 'word': 'India' }, function(err, newCp) {
                                     _io.of('/catchphrase').sockets[game.teams["TEAMA"]["PLAYER1"].socketId].emit('updatechat', "SERVER", "Your word is :" + newCp.word);
                                 });
                                 gameStateMachine.startGame();
                                //  //game.startTimer();
                                //  var changeTurn = function() {
                                //      //console.log(game.countdown);
                                //      game.countdown = game.countdown -1;
                                //      if(game.countdown <= 0) {
                                //          _io.of('/catchphrase').in(game.roomId).emit('updatechat', "SERVER","Time over");
                                //          clearInterval(startTimer);
                                //          game.countdown = 30;
                                //          game.passTurn(game.Round.currentTurn);
                                //          //console.log(game.Round);
                                //          CatchPhrase.findOne({ 'word': 'India' }, function(err, newCp) {
                                //              _io.of('/catchphrase').sockets[game.teams[game.getCurrentTurnTeam()][game.getCurrentTurnPlayer()].socketId].emit('updatechat', "SERVER", "Your word is :" + newCp.word);
                                //          });
                                //      }
                                //  }
                                //  var startTimer = setInterval(changeTurn, 1000);
                                 
                             }
                         }
                     } else {
                         //room not created, so create one.
                         var roomId = userId + socket.id;
         
                         var game = new CatchPhraseGameObj(arenaId, roomId);
                         var gameStateMachine = new CatchPhraseGameStateMachine(game, _io.of('/catchphrase'));
                         game.teams[teamId]["PLAYER1"].userId = userId;
                         game.teams[teamId]["PLAYER1"].username = username;
                         game.teams[teamId]["PLAYER1"].socketId = socket.id;
                         
                         CatchPhraseGames[arenaId] = game;
                         CatchPhraseGameStateMachines[arenaId] = gameStateMachine;
                         socket.join(roomId);
                         _io.of('/catchphrase').in(roomId).emit('updatechat', "SERVER", username + " has joined");
                         _io.of('/selectionarena').emit('loadcatchphraseroom');
                     }
            });

            

           
        });

        socket.on('sendchat', function (userId, arenaId, chatdata) {
            socket.emit('updatechat', socket.username, chatdata);
            socket.broadcast.emit('updatechat', socket.username, chatdata);
            var game = CatchPhraseGames[arenaId];
            var gameStateMachine = CatchPhraseGameStateMachines[arenaId];
            CatchPhraseGameHelper.doValidate(_io.of('/catchphrase'), game, gameStateMachine, userId, chatdata);
            // if(game.isaHint(game.getTeamId(userId))) {
            //     //Ignore
            // } else {
            //     //Validate
            //     _io.of('/catchphrase').in(game.roomId).emit('updatechat', "SERVER","I will validate");

            //     CatchPhrase.findOne({ 'word': chatdata }, function(err, cp) {
            //         if(cp) {
            //             _io.of('/catchphrase').in(game.roomId).emit('updatechat', "SERVER","CORRECT");
            //             //90sec over
            //             if(game.isRoundCompleted()) {
            //                 _io.of('/catchphrase').in(game.roomId).emit('updatechat', "SERVER","GAME OVER");
            //             } else {
            //                 game.passTurn();
            //             }
                         

            //              _io.of('/catchphrase').sockets[game.teams["TEAMB"]["PLAYER1"].socketId].emit('updatechat', "SERVER", "Your word is :" + cp.word);
            //         } else {
            //             _io.of('/catchphrase').in(game.roomId).emit('updatechat', "SERVER","INCORRECT");
            //         }
            //     });
            // }
        });
    });

}


var CatchphraseUtils = { 

    fetchTeam: function(userId, username, arenaId, title) {
        console.log("in arena");
        console.log(title);
        Arena.findOne({ 'title': title}, function(err, arena) {
            console.log("found in arena");
            console.log(arena);
            arena.teams.forEach(function(element) {
                if(element.userId.trim() === userId.trim())
                    return element.teamId.toUpperCase().trim();
            });
        });
        
    },
    
    fetchPlayerNo: function(game, teamId){
        if(game){
            if(game.teams[teamId]["PLAYER1"].userId.trim() === ""){
                return "PLAYER1";
            }
                return "PLAYER2";
        }
    }
}

/**
 * Initialize Socket.io name space
 *
 */
var init = function(_io) {
    // Define all Events
    ioEvents(_io);
    return _io;
}

module.exports = { init };