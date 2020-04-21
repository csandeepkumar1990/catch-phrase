'use strict';

var Mongoose = require('mongoose');

// Every user has a username
var CatchPhraseSchema = new Mongoose.Schema({
    word: { type: String, required: true},
    hint: { type: String, required: true}
});

// Create a user model
var catchPhraseModel = Mongoose.model('catchphrase', CatchPhraseSchema);

module.exports = catchPhraseModel;