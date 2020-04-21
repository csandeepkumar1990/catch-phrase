'use strict';


var Mongoose = require('mongoose');

// Connect to the database
Mongoose.connect("mongodb://127.0.0.1:27017/test");

// Throw an error if the connection fails
Mongoose.connection.on('error', function(err) {
  if (err) throw err;
});

// mpromise (mongoose's default promise library) is deprecated, 
// Plug-in your own promise library instead.
// Use native promises
Mongoose.Promise = global.Promise;

module.exports = {
  Mongoose,
  models: {
    user: require('./schemas/user.js'),
    arena: require('./schemas/arena.js'),
    catchphrase: require('./schemas/catchphrase.js'),
    rounds: require('./schemas/rounds.js'),
    player: require('./schemas/player.js'),
    ninetysecGame: require('./schemas/90secgame.js')
  }
};