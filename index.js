const dotenv = require('dotenv');
require('dotenv').config()
const path = require('path')
var cookieParser = require("cookie-parser");
const express = require("express")
const app = express();
const port = process.env.PORT;

app.use(express.json());
const cors = require("cors");
app.use(cors({ origin: process.env.APP_HOSTNAME , credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(function (error, req, res, next){
  //Catch json error
  if (error instanceof SyntaxError) {
    res.status(400).send("Syntax error")
  }
});


var publicPictures = path.join(__dirname, 'public');
app.use(express.static(publicPictures));

const apiRoutes = require('./api');
app.use('/api', apiRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('front/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'front', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`EMM server listening on port ${port}`);
});