'use strict';

var PlayerModel = require('../db').models.player;

var create = function (data, callback){
	var newUser = new PlayerModel(data);
	newUser.save(callback);
};

var findOne = function (data, callback){
	PlayerModel.findOne(data, callback);
}

var findById = function (id, callback){
	PlayerModel.findById(id, callback);
}

var removeById = function(data, callback){
	PlayerModel.deleteMany(data, callback);
}

var findOneAndUpdate = function(filter,  data, callback) {
    PlayerModel.findOneAndUpdate(filter,  data, callback);
}

module.exports = { 
	create, 
	findOne, 
	findById,
    removeById,
    findOneAndUpdate
};
