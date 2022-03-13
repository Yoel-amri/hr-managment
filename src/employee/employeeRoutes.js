const express = require('express');
const { authenticateUser } = require('../midllewares/authenticate_user');
const { upload } = require('../users/uploadRoutes');
const router = express.Router();

//Users Routes
const employeeControllers = require('./employeeControllers');

router.post('/employee/updateProfile', authenticateUser,employeeControllers.updateInfo);
router.post('/employee/updateProfileImage', authenticateUser ,upload.single('profile_img') ,employeeControllers.updateProfileImage);
router.get('/employee/getEmployeeInfo', authenticateUser, employeeControllers.getMyInfo);
router.get('/company/getOwnCompany', authenticateUser, employeeControllers.getCompany);


module.exports = router;
