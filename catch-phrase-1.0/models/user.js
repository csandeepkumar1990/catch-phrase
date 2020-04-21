'use strict';

var UserModel = require('../db').models.user;

var create = function (data, callback){
	var newUser = new UserModel(data);
	newUser.save(callback);
};

var findOne = function (data, callback){
	UserModel.findOne(data, callback);
}

var findById = function (id, callback){
	UserModel.findById(id, callback);
}

var removeById = function(data, callback){
	UserModel.deleteMany(data, callback);
}

module.exports = { 
	create, 
	findOne, 
	findById,
	removeById
};
