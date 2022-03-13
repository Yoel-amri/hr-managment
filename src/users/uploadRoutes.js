const express = require('express');

const multer = require('multer');
const path = require('path');

const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
      cb(null, `public/`);
  },
  filename: (req, file, cb) => {
      var imgName = uuidv4() + path.extname(file.originalname);
      req.imageName = imgName;
      cb(null, imgName);
  }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        if (file.mimetype !== "image/png" && file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg") {
            return callback(new Error('Only images allowed'))
        }
        callback(null, true)
    }
})

module.exports = {
    upload,
}