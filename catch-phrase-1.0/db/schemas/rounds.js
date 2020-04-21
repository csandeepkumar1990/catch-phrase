'use strict';

var Mongoose = require('mongoose');

var DEFAULT_ROUNDS = 4;
// Every user has a username
var RoundsSchema = new Mongoose.Schema({
    rounds: { type: Number, default: DEFAULT_ROUNDS },
    currentRound: { type: Number, default: 0 }
});

// Create a user model
var roundsModel = Mongoose.model('rounds', RoundsSchema);

module.exports = roundsModel;