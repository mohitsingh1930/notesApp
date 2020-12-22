const fs = require("fs");

const notes = require("../models/notes");


const stringToDate = require("../helpers/util").stringToDate;
const dateToString = require("../helpers/util").dateToString;

module.exports = {

	get: function (req, res) {

		let {id} = req.query;

		notes.findOne({_id: id, isRemoved: false}).exec()
		.then(result => {

			if(result === null) {
				return res.status(404).json({
					msg: "No data found for the given id: " + id
				})
			}


			result._doc.dateCreated = dateToString(result.dateCreated);
			result._doc.dateModified = dateToString(result.dateModified);

			res.status(200).json({
				note: result
			})

			notes.updateOne({_id: id}, {seen: true, lastSeen: new Date()})

		})
		.catch(err => res.status(500).json({msg: "Internal Server Error", err: err}))

	},

	getAll: function (req, res) {

		notes.find({isRemoved: false}, {title: 1, dateCreated: 1, dateModified: 1, remindAt: 1, seen: 1}).exec()
		.then(result => {
			res.status(200).json({
				notes: result.map(el => new Object({
					id: el.id,
					title: el.title,
					dateCreated: dateToString(el.dateCreated),
					dateModified: dateToString(el.dateModified),
					remindAt: el.remindAt
				}))
			})
		})
		.catch(err => res.status(500).json({msg: "Internal Server Error", err: err}))

	},

	getAttachment: function (req, res) {

		let {attachment} = req.query;

		res.sendFile("/home/mohitsingh1930/Desktop/Node practice/notesApp/notesData/" + attachment, (err => res.status(404).json({msg: "File not found"})));

	},

	add: function (req, res) {

		let { title, body, remindAt } = req.body;

		let reminderDate = stringToDate(remindAt);

		// console.log(req.file)



		notes.create({
			title,
			body,
			attachments: req.files?req.files.map(el => el.filename):[],
			remindAt: reminderDate
		})
		.then(result => {

			res.status(200).json({
				msg: "Note added",
				result
			})

		})
		.catch(err => res.status(500).json({msg: "Internal Server Error", err: err}))

	},

	addAttachment: function (req, res) {

		let {id} = req.body;

		console.log(id)

		notes.updateOne({_id: id, isRemoved: false}, {$push: {"attachments": {$each: req.files.map(el => el.filename)}}})
		.then(result => {

			console.log(result);

			if(result.n === 0) return res.status(404).json({
				msg: "No data found for given id: " + id
			})

			if(result.n === 1) {
				res.status(200).json({
					msg: "updated successfully"
				})
			}
		})
		.catch(err => res.status(500).json({msg: "Internal Server Error", err: err}))

	},

	delete: function (req, res) {

		let {id} = req.body;

		notes.findOne({_id: id, isRemoved: false}).exec()
		.then(result => {

			if(result === null) {
				res.status(404).json({
					msg: "No data found for the given id: " + id
				})
			} else {

				result.attachments.forEach(fileName => {
					fs.unlinkSync("/home/mohitsingh1930/Desktop/Node practice/notesApp/notesData/" + fileName);
				});

				notes.deleteOne({_id: id})
				.then(result => {
					console.log(result)

					res.status(200).json({
						msg: "deleted successfully"
					})
				})

			}

		})
		.catch(err => res.status(500).json({msg: "Internal Server Error", err: err}))

	},

	deleteAttachment: function (req, res) {

		let {id, fileName} = req.body;

		fs.unlink("/home/mohitsingh1930/Desktop/Node practice/notesApp/notesData/" + fileName, (err) => {

			if(err) {
				return res.status(500).json({msg: "Internal Server Error", err})
			}

			notes.updateOne({_id: id, isRemoved: false}, {$pull: {"attachments": fileName}})
			.then(result => {

				console.log(result);

				if(result.n === 0) return res.status(404).json({
					msg: "No data found for given id: " + id
				})

				if(result.n === 1) {
					res.status(200).json({
						msg: "deleted successfully"
					})
				}
			})
			.catch(err => res.status(500).json({msg: "Internal Server Error", err: err}))

		});

	},

	remove: function (req, res) {

		let {id} = req.body;

		notes.updateOne({_id: id, isRemoved: false}, {isRemoved: true, removedAt: new Date()})
		.then(result => {

			res.status(200).json({
				msg: "removed successfully"
			})
		})
		.catch(err => res.status(500).json({msg: "Internal Server Error", err: err}))

	},

	update: function (req, res) {

		let {id} = req.body;

		delete req.body.id;

		let updateQuery = {...req.body};

		if(updateQuery.remindAt)
			updateQuery.remindAt = stringToDate(updateQuery.remindAt);

		updateQuery.dateModified = new Date();

		notes.updateOne({_id: id, isRemoved: false}, updateQuery)
		.then(result => {

			console.log(result);

			if(result.n === 0) return res.status(404).json({
				msg: "No data found for given id: " + id
			})

			if(result.n === 1) {
				res.status(200).json({
					msg: "updated successfully"
				})
			}
		})
		.catch(err => res.status(500).json({msg: "Internal Server Error", err: err}))
	},

	searchByTitle: function (req, res) {

		let {title} = req.query;

		notes.find({title: {$regex: title}, isRemoved: false}, {title: 1, dateCreated: 1, dateModified: 1, remindAt: 1, seen: 1}).exec()
		.then(result => {

			result.forEach(element => {

				element._doc.remindAt = dateToString(element.remindAt);

			});

			res.status(200).json({
				notes: result
			})

		})
		.catch(err => res.status(500).json({msg: "Internal Server Error", err: err}))

	},

	getPendingReminders: function (req, res) {

		notes.find({remindAt: {$lt: new Date()}, seen: false, isRemoved: false}, {title: 1, dateCreated: 1, dateModified: 1, remindAt: 1, seen: 1}).exec()
		.then(result => {

			result.forEach(element => {
				element._doc.remindAt = dateToString(element.remindAt);
			});

			res.status(200).json({
				notes: result
			})

		})
		.catch(err => res.status(500).json({msg: "Internal Server Error", err: err}))

	}

}
