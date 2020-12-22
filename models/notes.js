const mongoose = require('mongoose');

const {dateToString} = require('../helpers/util');

const schema = mongoose.Schema({

	title: String,
	body: String,
	dateCreated: {type: Date, default: new Date()},
	dateModified: {type: Date, default: new Date()},
	attachments: [String],
	remindAt: {type: Date},
	isRemoved: {type: Boolean, default: false},
	removedAt: {type: Date},
	seen: {type: Boolean, default: false},
	lastSeen: {type: Date}

})


module.exports = mongoose.model('notes', schema);