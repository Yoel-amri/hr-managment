const express = require('express');
const router = express.Router();

//Users Routes
const usersControllers = require('./usersControllers');

const uploadRoutes = require('./uploadRoutes');

router.post('/signUp/:token', usersControllers.signUpEmployee);
router.post('/signUp/system_admin/:token', usersControllers.signUpSysAdmin);
router.post('/login', usersControllers.login);

module.exports = router;
       