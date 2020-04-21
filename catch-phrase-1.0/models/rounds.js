'use strict';

var RoundsModel = require('../db').models.rounds;

var create = function (data, callback){
	var newUser = new RoundsModel(data);
	newUser.save(callback);
};

var findOne = function (data, callback){
	RoundsModel.findOne(data, callback);
}

var findById = function (id, callback){
	RoundsModel.findById(id, callback);
}

var removeById = function(data, callback){
	RoundsModel.deleteMany(data, callback);
}

var findOneAndUpdate = function(filter,  data, callback) {
    RoundsModel.findOneAndUpdate(filter,  data, callback);
}

module.exports = { 
	create, 
	findOne, 
	findById,
    removeById,
    findOneAndUpdate
};
