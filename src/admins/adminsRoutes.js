const express = require('express');
const { authenticateAdmin } = require('../midllewares/authenticate_admin');
const router = express.Router();
const {upload} = require('../users/uploadRoutes');
//Users Routes
const adminsControllers = require('./adminsControllers');

router.post('/employee/inviteEmployee', authenticateAdmin, adminsControllers.inviteEmployee);
router.post('/employee/updateProfile', authenticateAdmin, adminsControllers.updateEmployeeInfo);
router.get('/employee/getEmployeeInfo', authenticateAdmin, adminsControllers.getEmployeeInfo);
router.get('/employee/findUsers', authenticateAdmin, adminsControllers.findEmployees);
router.post('/employee/updateProfileImage', authenticateAdmin, upload.single('profile_img'), adminsControllers.updateProfileImage);
router.get('/employee/invitations', authenticateAdmin, adminsControllers.getInvitations)
router.post('/employee/cancelInvite', authenticateAdmin, adminsControllers.cancelInvite)

router.post('/company/updateCompany', authenticateAdmin, adminsControllers.updateCompany)
router.post('/company/updateCompanyImage', authenticateAdmin, upload.single('profile_img') ,adminsControllers.updateCompanyImage);
router.get('/company/getOwnCompany', authenticateAdmin, adminsControllers.getOwnCompany)
module.exports = router;
