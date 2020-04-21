'use strict';

var Mongoose = require('mongoose');

var DEFAULT_ROUNDS = 5;
var DEFAULT_PLAYERS = 2;
/**
 * Each connection object represents a user connected through a unique socket.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
var ninetysecGameSchema = new Mongoose.Schema({
  title: { type: String },
  arenaId: { type: String},
  battlefieldId: { type: String},
  connections: { type: [{ userId: String, socketId: String }] },
  isOpen: { type: Boolean, default: true },
  owner: { type: { userId: String, socketId: String } },
  rounds: { type: Number, default: DEFAULT_ROUNDS },
  currentRound: { type: Number, default: 0 },
  noOfPlayers: { type: Number, default: DEFAULT_PLAYERS },
  createdAt: { type: Date, default: Date.now },
  teams: { type: [{ teamId: String, userId: String }] },
  score: {
    type: [{ round: Number, answers: Object, _id: { id: false } }],
    default: [{ round: 0, answers: {} }]
  }
});

var ninetysecGameModel = Mongoose.model('ninetysecGame', ninetysecGameSchema);

module.exports = ninetysecGameModel;