'use strict';

var Mongoose = require('mongoose');

// Every user has a username
var PlayerSchema = new Mongoose.Schema({
    roomId: { type: String},
    teamId: { type: String},
    userName: { type: String},
    userId: { type: String},
    socketId: { type: String},
    gotaWord: { type: String},
    sentaHint: { type: String}
});

// Create a user model
var playerModel = Mongoose.model('player', PlayerSchema);

module.exports = playerModel;