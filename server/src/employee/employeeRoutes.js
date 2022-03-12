const express = require('express');
const { authenticateUser } = require('../midllewares/authenticate_user');
const { upload } = require('../users/uploadRoutes');
const router = express.Router();

//Users Routes
const employeeControllers = require('./employeeControllers');

router.post('/updateInfo', authenticateUser,employeeControllers.updateInfo);
router.post('/updateProfileImage', authenticateUser ,upload.single('profile_image') ,employeeControllers.updateProfileImage);
router.get('/getMyInfo', authenticateUser, employeeControllers.getMyInfo);
router.get('/companyInfo', authenticateUser, employeeControllers.getCompany);


module.exports = router;
