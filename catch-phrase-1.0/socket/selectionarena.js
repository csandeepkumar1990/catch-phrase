var User = require('../models/user');
var Arena = require('../models/arena');
var CatchPhrase = require('../models/catchphrase');
var Player = require('../models/player');
var Rounds = require('../models/rounds');

/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */

var ioEvents = function(IO) {
    IO.on('connection', function(socket) {
        console.log("Connected to /selectionarena nsp");

        socket.on('joingameroom', function(userId, roomId) {
            Arena.findById(roomId, function(err, room) {
                Arena.addUser(room, userId, socket.id, function(err, room) {
                    Arena.getUsers(room, userId, function(err, users, cuntUserInRoom) {
                        if (err) 
                            throw err;
                        // Return list of all user connected to the room to the current user
                        socket.emit('updateUsersList', users, true);
                        socket.broadcast.emit('updateUsersList', users, true);
                      });
                });
                
            });
            
        });
                        
        socket.on('saveteamdata', function ( users, usernames, teams, roomId) {
            Arena.findById(roomId, function(err, room) {
                for ( i =0; i< 4; i++) {
                    var userId = users[i].trim();
                    var teamId = teams[i].trim();
                    var username = usernames[i].trim();
                    console.log(userId);
                    console.log(teamId);
                    Arena.addTeam(room, teamId, userId, username, function(err, newRoom) {


                    });
                }
              
            });
        });


        // When a socket exits
        socket.on('disconnect', function() {
        
            
        });

        socket.on('joinplaycatchphrase', function(userId, roomId) {
            Arena.findById(roomId, function(err, room) {
                Arena.addUser(room, userId, socket.id, function(err, room) {
                    Arena.getUsers(room, userId, function(err, users, cuntUserInRoom) {
                        if (err) 
                            throw err;
                        // Return list of all user connected to the room to the current user
                        socket.emit('updateUsersList', users, true);
                        socket.broadcast.emit('updateUsersList', users, true);
                      });
                });
                
            });
            
        });
    
    });

}

/**
 * Initialize /selectionarena name space
 *
 */
var init = function(_io) {
    var nsp = _io.of('/selectionarena');
    // Define all Events
    ioEvents(nsp);
    return _io;
}

module.exports = { init };