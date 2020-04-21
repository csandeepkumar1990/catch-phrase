'use strict';

var CatchPhraseModel = require('../db').models.catchphrase;

var create = function (data, callback){
	var newUser = new CatchPhraseModel(data);
	newUser.save(callback);
};

var findOne = function (data, callback){
	CatchPhraseModel.findOne(data, callback);
}

var findById = function (id, callback){
	CatchPhraseModel.findById(id, callback);
}

var removeById = function(data, callback){
	CatchPhraseModel.deleteMany(data, callback);
}

module.exports = { 
	create, 
	findOne, 
	findById,
	removeById
};
