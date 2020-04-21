'use strict';

var Mongoose = require('mongoose');

var DEFAULT_ROUNDS = 5;
var DEFAULT_PLAYERS = 2;
/**
 * Each connection object represents a user connected through a unique socket.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
var ArenaSchema = new Mongoose.Schema({
  title: { type: String, required: true },
  connections: { type: [{ userId: String, socketId: String }] },
  isOpen: { type: Boolean, default: true },
  owner: { type: { userId: String, socketId: String } },
  rounds: { type: Number, default: DEFAULT_ROUNDS },
  currentRound: { type: Number, default: 0 },
  noOfPlayers: { type: Number, default: DEFAULT_PLAYERS },
  createdAt: { type: Date, default: Date.now },
  // questions: { type: Array }
  teams: { type: [{ teamId: String, userId: String, username:String }] },
  score: {
    type: [{ round: Number, answers: Object, _id: { id: false } }],
    default: [{ round: 0, answers: {} }]
  }
});

var arenaModel = Mongoose.model('arena', ArenaSchema);

module.exports = arenaModel;