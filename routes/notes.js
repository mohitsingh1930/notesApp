const router = require('express').Router()
const multer = require('multer')

const notes = require('../controllers/notes');
const notesController = require("../controllers/notes");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/../notesData")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.substring(file.originalname.lastIndexOf(".")))
  }
})

const upload = multer({
	storage,
	limits: {
		fieldSize: 1024*1024*5
	}
})


router.get('/', notesController.get);

router.get('/all', notes.getAll);

router.get('/attachment', notesController.getAttachment);

router.post('/add', upload.array('file'), notesController.add);

router.put('/update', notesController.update);

router.put('/addAttachment', upload.array('fileName'), notesController.addAttachment);

router.delete('/delete', notesController.delete);

router.delete('/deleteAttachment', notesController.deleteAttachment)

router.get('/search', notesController.searchByTitle);

router.get('/pending', notesController.getPendingReminders);

module.exports = router;