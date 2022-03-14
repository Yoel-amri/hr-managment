const express = require('express');
const router = express.Router();

//Users Routes
const usersControllers = require('./usersControllers');

const uploadRoutes = require('./uploadRoutes');

router.post('/signUp/:token', usersControllers.signUpEmployee);
router.post('/login', usersControllers.login);
router.post('/logout', usersControllers.logout)
module.exports = router;
       