const express = require('express');
const { authenticateSysAdmin } = require('../midllewares/system_admin_middleware');
const { upload } = require('../users/uploadRoutes');
const router = express.Router();

const systemAdminControllers = require('./systemAdminControllers');

router.post('/inviteSysAdmin', authenticateSysAdmin, systemAdminControllers.createSysAdmin);
router.get('/getSystemAdmins', authenticateSysAdmin, systemAdminControllers.getSystemAdmins);

router.post('/company/updateCompany', authenticateSysAdmin, systemAdminControllers.updateCompanyInfo);
router.post('/company/createCompany', authenticateSysAdmin, systemAdminControllers.createCompany);
router.get('/company/getAllCompanies', authenticateSysAdmin, systemAdminControllers.getAllCompanies);
router.post('/company/UpdateProfileImage', authenticateSysAdmin, upload.single('profile_img'), systemAdminControllers.updateCompanyProfileImage);

router.post('/employee/inviteEmployee', authenticateSysAdmin ,systemAdminControllers.createEmployee);
router.post('/employee/updateProfile', authenticateSysAdmin, systemAdminControllers.updateEmployee);
router.get('/employee/findUsers', authenticateSysAdmin, systemAdminControllers.findEmployees);
router.get('/employee/getEmployeeInfo', authenticateSysAdmin, systemAdminControllers.getEmployeeInfo);
router.post('/employee/updateProfileImage', authenticateSysAdmin, upload.single('profile_img'), systemAdminControllers.updateEmployeeProfileImage);
router.get('/employee/invitations', authenticateSysAdmin, systemAdminControllers.getInvitations)
router.post('/employee/cancelInvite', authenticateSysAdmin, systemAdminControllers.cancelInvite)


module.exports = router;