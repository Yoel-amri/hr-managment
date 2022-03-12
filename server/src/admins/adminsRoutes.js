const express = require('express');
const { authenticateAdmin } = require('../midllewares/authenticate_admin');
const router = express.Router();
const {upload} = require('../users/uploadRoutes');
//Users Routes
const adminsControllers = require('./adminsControllers');

router.post('/employee/inviteEmployee', authenticateAdmin, adminsControllers.inviteEmployee);
router.post('/employee/updateEmployeeInfo', authenticateAdmin, adminsControllers.updateEmployeeInfo);
router.get('/employee/getEmployeeInfo', authenticateAdmin, adminsControllers.getEmployeeInfo);

router.post('/employee/updateProfileImage', authenticateAdmin, upload.single('profile_image'), adminsControllers.updateProfileImage);
router.get('/employee/invitations', authenticateAdmin, adminsControllers.getInvitations)
router.post('employee/cancelInvite', authenticateAdmin, adminsControllers.cancelInvite)

router.post('/company/updateCompamny', authenticateAdmin, adminsControllers.updateCompany)
router.post('/company/updateCompanyImage', authenticateAdmin, upload.single('profile_image') ,adminsControllers.updateCompanyImage);

module.exports = router;
