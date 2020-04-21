var User = require('../models/user');
var Arena = require('../models/arena');
var CatchPhrase = require('../models/catchphrase');
var Player = require('../models/player');
var Rounds = require('../models/rounds');
var PasswordGameObj = require("../game/password1.game");
var PasswordGameStateMachine = require("../state/password.state");
var PasswordGames = {};
var PasswordGameStateMachines = {};
var PasswordGameHelper = require("../helpers/password.helper");
var MAX_PLAYERS = 4;

/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */

var ioEvents = function(_io) {

    _io.of('/password').on('connection', function(socket) {
        //console.log("in the game" +PasswordGames[arenaId]);
        
        socket.on('joinpasswordroom', function(userId, username, arenaId, title) {
            socket.username = username;
            var teamId;
            Arena.findOne({ 'title': title}, function(err, arena) {
                 arena.teams.forEach(function(element) {
                     if(element.userId === userId)
                     teamId = element.teamId.toUpperCase();

                     
                 });
                 console.log(PasswordGames[arenaId]);
                 var game = PasswordGames[arenaId];
                 var gameStateMachine = PasswordGameStateMachines[arenaId];
                 console.log("in the game" +PasswordGames[arenaId]);
                     if(game) {
                         var playerNo = CatchphraseUtils.fetchPlayerNo(game, teamId);
                         //Room already created
                         game.teams[teamId][playerNo].userId = userId;
                         game.teams[teamId][playerNo].username = username;
                         game.teams[teamId][playerNo].socketId = socket.id;
                         
                         if(!socket.rooms[game.roomId]){
                             socket.join(game.roomId);
                             _io.of('/password').in(game.roomId).emit('updatechat', "SERVER", username + " has joined");
                             var clientsInRoom = _io.of(socket.nsp.name).adapter.rooms[game.roomId];
                             var numClients = clientsInRoom === undefined ? [] : Object.keys(clientsInRoom.sockets);
                             if(numClients.length === MAX_PLAYERS){
                                 _io.of('/password').in(game.roomId).emit('updatechat', "SERVER",  " START THE GAME");
                                 _io.of('/password').in(game.roomId).emit('updatechat', "SERVER",  "TURN TO : " +game.getInnerCurrentTurnTeam());
                                 CatchPhrase.findOne({ 'word': 'India' }, function(err, newCp) {
                                     _io.of('/password').sockets[game.teams["TEAMA"]["PLAYER1"].socketId].emit('updatechat', "SERVER", "Your word is :" + newCp.word);
                                     _io.of('/password').sockets[game.teams["TEAMB"]["PLAYER1"].socketId].emit('updatechat', "SERVER", "Your word is :" + newCp.word);
                                 });

                                 gameStateMachine.startGame();

                                 //game.startTimer();
                                //  var changeTurn = function() {
                                //      //console.log(game.countdown);
                                //      game.countdown = game.countdown -1;
                                //      if(game.countdown <= 0) {
                                //          _io.of('/password').in(game.roomId).emit('updatechat', "SERVER","Time over");
                                //          clearInterval(startTimer);
                                //          game.countdown = 30;
                                //          game.passTurn(game.Round.currentTurn);
                                //          //console.log(game.Round);
                                //          CatchPhrase.findOne({ 'word': 'India' }, function(err, newCp) {
                                //              _io.of('/password').sockets[game.teams[game.getCurrentTurnTeam()][game.getCurrentTurnPlayer()].socketId].emit('updatechat', "SERVER", "Your word is :" + newCp.word);
                                //          });
                                //      }
                                //  }
                                // var startTimer = setInterval(changeTurn, 1000);
                                 
                             }
                         }
                     } else {
                         //room not created, so create one.
                         var roomId = userId + socket.id;
         
                         var game = new PasswordGameObj(arenaId, roomId);
                         var gameStateMachine = new PasswordGameStateMachine(game, _io.of('/password'));
                         game.teams[teamId]["PLAYER1"].userId = userId;
                         game.teams[teamId]["PLAYER1"].username = username;
                         game.teams[teamId]["PLAYER1"].socketId = socket.id;
                         
                         PasswordGames[arenaId] = game;
                         PasswordGameStateMachines[arenaId] = gameStateMachine;
                         console.log(PasswordGames[arenaId]);
                         socket.join(roomId);
                         _io.of('/password').in(roomId).emit('updatechat', "SERVER", username + " has joined");
                         _io.of('/selectionarena').emit('loadpasswordroom');
                     }
            });

            

           
        });

        socket.on('sendchat', function (userId, arenaId, chatdata) {
            socket.emit('updatechat', socket.username, chatdata);
            socket.broadcast.emit('updatechat', socket.username, chatdata);
            var game = PasswordGames[arenaId];
            var gameStateMachine = PasswordGameStateMachines[arenaId];

            PasswordGameHelper.doValidate(_io.of('/password'), game, gameStateMachine, userId, chatdata);

            // if(game.isaHint(game.getTeamId(userId))) {
            //     //Ignore
            // } else {
            //     //Validate
            //     _io.of('/password').in(game.roomId).emit('updatechat', "SERVER","I will validate");

            //     CatchPhrase.findOne({ 'word': chatdata }, function(err, cp) {
            //         if(cp) {
            //             _io.of('/password').in(game.roomId).emit('updatechat', "SERVER","CORRECT");
            //             //90sec over
            //             if(game.isRoundCompleted()) {
            //                 _io.of('/password').in(game.roomId).emit('updatechat', "SERVER","GAME OVER");
            //             } else {
            //                 //game.passTurn();
            //                 game.passTurn(game.Round.currentTurn);
            //                              //console.log(game.Round);
            //                              CatchPhrase.findOne({ 'word': 'India' }, function(err, newCp) {
            //                                  _io.of('/password').sockets[game.teams[game.getCurrentTurnTeam()][game.getCurrentTurnPlayer()].socketId].emit('updatechat', "SERVER", "Your word is :" + newCp.word);
            //                              });
            //             }
                         

            //              //_io.of('/password').sockets[game.teams["TEAMB"]["PLAYER1"].socketId].emit('updatechat', "SERVER", "Your word is :" + cp.word);
            //         } else {
            //             _io.of('/password').in(game.roomId).emit('updatechat', "SERVER","INCORRECT");
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