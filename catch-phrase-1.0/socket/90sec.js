var User = require('../models/user');
var Arena = require('../models/arena');
var CatchPhrase = require('../models/catchphrase');
var Player = require('../models/player');
var Rounds = require('../models/rounds');
var NinetysecGame = require('../models/90secgame');
var NinetysecGameObj = require("../game/90sec.game");
var NinetysecGameStateMachine = require("../state/90sec.state");
var NinetysecGames = {};
var NinetysecGameStateMachines = {};
var NinetysecGameHelper = require("../helpers/90sec.helper")
var MAX_PLAYERS = 2;

/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */

var ioEvents = function(_io) {

    _io.of('/90sec').on('connection', function(socket) {

        

        console.log("In /90sec name space");
        console.log(NinetysecGames);
        socket.on('join90secroom', function(userId, username, arenaId, title) {
            socket.username = username;

            Arena.findOne({ 'title': title}, function(err, arena) {
                arena.teams.forEach(function(element) {
                    if(element.userId === userId)
                    teamId = element.teamId.toUpperCase();

                    
                });
            var game = NinetysecGames[arenaId];
            var gameStateMachine = NinetysecGameStateMachines[arenaId];
            if(game) {  //Room already created
                
                game.teams[teamId]["PLAYER1"].userId = userId;
                game.teams[teamId]["PLAYER1"].username = username;
                game.teams[teamId]["PLAYER1"].socketId = socket.id;
                

                if(!socket.rooms[game.roomId]){
                    socket.join(game.roomId);
                    _io.of('/90sec').in(game.roomId).emit('updatechat', "SERVER", username + " has joined");

                    if(gameStateMachine.isRoomfull()){
                        CatchPhrase.findOne({ 'word': 'India' }, function(err, newCp) {
                            if(_io.of('/90sec').sockets[game.teams["TEAMA"]["PLAYER1"].socketId])
                            _io.of('/90sec').sockets[game.teams["TEAMA"]["PLAYER1"].socketId].emit('updatechat', "SERVER", "Your word is :" + newCp.word);
                        });
                        gameStateMachine.startGame();
                        
                    }
                }
            } else { //room not created, so create one.

                var roomId = userId + socket.id;

                var game = new NinetysecGameObj(arenaId, roomId);
                var gameStateMachine = new NinetysecGameStateMachine(game, _io.of('/90sec'));
                
                game.teams[teamId]["PLAYER1"].userId = userId;
                game.teams[teamId]["PLAYER1"].username = username;
                game.teams[teamId]["PLAYER1"].socketId = socket.id;
                
                NinetysecGames[arenaId] = game;
                NinetysecGameStateMachines[arenaId] = gameStateMachine;
                
                socket.join(roomId);
                
                _io.of('/90sec').in(roomId).emit('updatechat', "SERVER", username + " has joined");
                _io.of('/selectionarena').emit('load90secroom');
            }
        });

            

        });

        socket.on('sendchat', function (userId, arenaId, chatdata) {
            socket.emit('updatechat', socket.username, chatdata);
            socket.broadcast.emit('updatechat', socket.username, chatdata);
            var game = NinetysecGames[arenaId];
            var gameStateMachine = NinetysecGameStateMachines[arenaId];
            NinetysecGameHelper.doValidate(_io.of('/90sec'), game, gameStateMachine, userId, chatdata);
        });

        socket.on('powerpass', function (userId, arenaId, chatdata) {
           var game = NinetysecGames[arenaId];
           NinetysecGameHelper.sendAWord(_io.of('/90sec'), game);
        });

        socket.on('freezo', function (userId, arenaId, chatdata) {
            var game = NinetysecGames[arenaId];
            var gameStateMachine = NinetysecGameStateMachines[arenaId];
            gameStateMachine.addTime();
         });
    });


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
