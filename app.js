const express = require('express');

const app = express();


app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({limit: "10kb"}));

app.use('/notes', require("./routes/notes"));


app.all('*', (req, res, next) => {
  res.sendStatus(404);
});


module.exports = app;
