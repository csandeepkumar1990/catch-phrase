'use strict';

var arenaModel = require('../db').models.arena;
var User = require('./user');


var create = function(data, callback) {
  var newArena = new arenaModel(data);
  newArena.save(callback);
};

var find = function(data, callback) {
  arenaModel.find(data, callback);
}

var findOne = function(data, callback) {
  arenaModel.findOne(data, callback);
}

var findById = function(id, callback) {
  arenaModel.findById(id, callback);
}


/**
 * Add a user along with the corresponding socket to the passed arena
 *
 */
var addUser = function(arena, userId, socket, callback) {

  // Get current user's id
  //var userId = socket.request.session.passport.user;

  // Push a new connection object(i.e. {userId + socketId})
  var conn = { userId: userId, socketId: socket.id };
  if(arena) {
    arena.connections.push(conn);
    arena.save(callback);
  }
  
}

/**
 * Add a user along with the corresponding socket to the passed arena
 *
 */
var addTeam = function(arena, teamId, userId, username, callback) {

  // Get current user's id
  //var userId = socket.request.session.passport.user;

  // Push a new connection object(i.e. {userId + socketId})
  var team = { teamId: teamId, userId: userId, username: username };
  arena.teams.push(team);
  arena.save(callback);
}

/**
 * Get all users in a arena
 *
 */
var getUsers = function(arena, userId, callback) {

  var users = [],
    vis = {},
    cunt = 0;
  var userId = userId;

  // Loop on arena's connections, Then:
  arena.connections.forEach(function(conn) {

    // 1. Count the number of connections of the current user(using one or more sockets) to the passed arena.
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
 * Remove a user along with the corresponding socket from a arena
 *
 */
var removeUser = function(socket, callback) {

  // Get current user's id
  var userId = socket.userId;

  find(function(err, arenas) {
    if (err) { return callback(err); }

    // Loop on each arena, Then:
    arenas.every(function(arena) {
      var pass = true,
        cunt = 0,
        target = 0;

      // For every arena, 
      // 1. Count the number of connections of the current user(using one or more sockets).
      arena.connections.forEach(function(conn, i) {
        if (conn.userId === userId) {
          cunt++;
        }
        if (conn.socketId === socket.id) {
          pass = false, target = i;
        }
      });

      // 2. Check if the current arena has the disconnected socket, 
      // If so, then, remove the current connection object, and terminate the loop.
      if (!pass) {
        arena.connections.id(arena.connections[target]._id).remove();
        arena.save(function(err) {
          callback(err, arena, userId, cunt);
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