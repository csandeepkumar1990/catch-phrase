'use strict';

var ninetysecGameModel = require('../db').models.ninetysecGame;
var User = require('./user');


var create = function(data, callback) {
  var newNinetysecGamefield = new ninetysecGameModel(data);
  newNinetysecGamefield.save(callback);
};

var find = function(data, callback) {
  ninetysecGameModel.find(data, callback);
}

var findOne = function(data, callback) {
  ninetysecGameModel.findOne(data, callback);
}

var findById = function(id, callback) {
  ninetysecGameModel.findById(id, callback);
}


/**
 * Add a user along with the corresponding socket to the passed ninetysecGame
 *
 */
var addUser = function(ninetysecGame, userId, socket, callback) {

  // Get current user's id
  //var userId = socket.request.session.passport.user;

  // Push a new connection object(i.e. {userId + socketId})
  var conn = { userId: userId, socketId: socket.id };
  if(ninetysecGame) {
    ninetysecGame.connections.push(conn);
    ninetysecGame.save(callback);
  }
  
}

/**
 * Add a user along with the corresponding socket to the passed ninetysecGame
 *
 */
var addTeam = function(ninetysecGame, teamId, userId, callback) {

  // Get current user's id
  //var userId = socket.request.session.passport.user;

  // Push a new connection object(i.e. {userId + socketId})
  var team = { teamId: teamId, userId: userId };
  ninetysecGame.teams.push(team);
  ninetysecGame.save(callback);
}

/**
 * Get all users in a ninetysecGame
 *
 */
var getUsers = function(ninetysecGame, userId, callback) {

  var users = [],
    vis = {},
    cunt = 0;
  var userId = userId;

  // Loop on ninetysecGame's connections, Then:
  ninetysecGame.connections.forEach(function(conn) {

    // 1. Count the number of connections of the current user(using one or more sockets) to the passed ninetysecGame.
    if (conn.userId === userId) {
      cunt++;
    }

    // 2. Create an array(i.e. users) contains unique users' ids
    if (!vis[conn.userId]) {
      users.push(conn.userId);
    }
    vis[conn.userId] = true;
  });

  // Loop on each user id, Then:
  // Get the user object by id, and assign it to users array.
  // So, users array will hold users' objects instead of ids.
  users.forEach(function(userId, i) {
    User.findById(userId, function(err, user) {
      if (err) { return callback(err); }
      users[i] = user;
      if (i + 1 === users.length) {
        return callback(null, users, cunt);
      }
    });
  });
}

/**
 * Remove a user along with the corresponding socket from a ninetysecGame
 *
 */
var removeUser = function(socket, callback) {

  // Get current user's id
  var userId = socket.userId;

  find(function(err, ninetysecGames) {
    if (err) { return callback(err); }

    // Loop on each ninetysecGame, Then:
    ninetysecGames.every(function(ninetysecGame) {
      var pass = true,
        cunt = 0,
        target = 0;

      // For every ninetysecGame, 
      // 1. Count the number of connections of the current user(using one or more sockets).
      ninetysecGame.connections.forEach(function(conn, i) {
        if (conn.userId === userId) {
          cunt++;
        }
        if (conn.socketId === socket.id) {
          pass = false, target = i;
        }
      });

      // 2. Check if the current ninetysecGame has the disconnected socket, 
      // If so, then, remove the current connection object, and terminate the loop.
      if (!pass) {
        ninetysecGame.connections.id(ninetysecGame.connections[target]._id).remove();
        ninetysecGame.save(function(err) {
          callback(err, ninetysecGame, userId, cunt);
        });
      }

      return pass;
    });
  });
}

module.exports = {
  create,
  find,
  findOne,
  findById,
  addUser,
  addTeam,
  removeUser,
  getUsers
};