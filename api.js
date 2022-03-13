const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const { SqlError, SqlDuplicateColumnError, OrmError } = require('./src/services/dbErrors');
const router = express.Router();
const multer = require('multer');
const systemAdminRoutes = require('./src/system_admin/systemAdminRoutes');
const employeeRoutes = require('./src/employee/employeeRoutes');
const usersRoutes = require('./src/users/usersRoutes')
const adminsRoutes = require('./src/admins/adminsRoutes');



router.use('/system_admin', systemAdminRoutes);
router.use('/employee', employeeRoutes);
router.use('/users', usersRoutes);
router.use('/admins', adminsRoutes);

router.use((error, req, res, next) => {
    console.log("Error Handling Middleware called !!!")
    console.log("Error message ===>" ,error.message)
    console.log("Error name    ===>", error.name)
    console.log('In path: ', req.path)
    
    if (error instanceof JsonWebTokenError) {
        return res.status(400).send('Invalid JWT');
    }
    else if (error instanceof multer.MulterError) {
        return res.status(500).send("Error uploading file");
    }
    else if (error instanceof SqlDuplicateColumnError) {
        return res.status(400).send(`${error.duplicateColumn} already exists !`);
    }
    else if (error instanceof OrmError || error instanceof SqlError) {
        return res.status(500).send("Internal server error");
    }
    else {
        return res.status(500).send("Internal server error !")
    }
  })

module.exports = router;