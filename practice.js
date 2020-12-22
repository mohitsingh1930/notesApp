const util = require("./helpers/util");
const dotenv = require('dotenv');

dotenv.config({path: "./config.env"})

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: true,
	useUnifiedTopology: true,
})
const notes = require("./models/notes");

let title = "2";
let regex = new RegExp(`${title}`);
notes.find({title: {$regex: title}}).then(console.log).catch(console.log)