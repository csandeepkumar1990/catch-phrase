'use strict';

var Mongoose = require('mongoose');

// Every user has a username
var UserSchema = new Mongoose.Schema({
    username: { type: String, required: true}
});

// Create a user model
var userModel = Mongoose.model('user', UserSchema);

module.exports = userModel;