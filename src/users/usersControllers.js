const {
    validateSignUpInput,
    validateUpdateInput,
    validateSignInInput,
    validateResetInput
} = require("../lib/inputValidator");
const {
    hashPassword,
} = require("../lib/hashPassword");
const {users} = require("../services/schema/types");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var fs = require('fs');


async function signUpEmployee(req, res, next) {
    const token = req.params.token;
    let userData = {
        ...req.body,
    }

    if (!req.body.firstname || !req.body.lastname || !req.body.password 
        || !req.body.passwordConfirmation) {
        return res.status(400).send('INVALID REQUEST');
    }

    if (userData.password !== userData.passwordConfirmation)
        res.status(500).send('Passwords do not match !');
    
    try {
        let invitedUser = await jwt.verify(token, process.env.APP_SECRET);
        userData = {
            ...userData,
            ...invitedUser,
        }
        await users.update({
            data: {
                invitation: 'ACCEPTED',
                password: await hashPassword(userData.password),
                firstname: userData.firstname,
                lastname: userData.lastname,
                department: userData.department,
                phone_number: userData.phone_number,
                address: userData.address,
                postal_code: userData.postal_code,
                remarks: userData.remarks,
                birthday: userData.birthday,
            },
            where: {
                email: userData.email,
            },
        })
    } catch (e) {
        return next(e);
    }
    return res.status(200).send(userData);
}

async function signUpSysAdmin(req, res, next) {
    const token = req.params.token;
    let userData = {
        ...req.body,
    }

    try {
        let invitedUser = await jwt.verify(token, process.env.APP_SECRET);
        userData = {
            ...userData,
            ...invitedUser,
        }
    }
    catch (e) {
        return next(e);
    }

    
    /// Checking client data
    if (!req.body.firstname || !req.body.lastname || !req.body.password 
        || !req.body.passwordConfirmation) {
        return res.status(400).send('INVALID REQUEST');
    }


    /// Adding user record to database
    if (userData.password !== userData.passwordConfirmation)
        res.status(400).send('Passwords do not match !');
    
    try {
        await users.update({
            data: {
                invitation: 'ACCEPTED',
                password: await hashPassword(userData.password),
                firstname: userData.firstname,
                lastname: userData.lastname,
                department: userData.department,
                phone_number: userData.phone_number,
                address: userData.address,
                postal_code: userData.postal_code,
                remarks: userData.remarks,
            },
            where: {
                email: userData.email,
            },
        })
    } catch (e) {
        return next(e);
    }
    return res.status(200).send(userData);
}

async function login(req, res, next) {
    const loggedUser = await users.findMany({
        where: {
            email: req.body.email,
            invitation: 'ACCEPTED'
        }
    })
    if (!loggedUser.length)
        return res.status(401).send("Email or Password is incorrect !")
    // console.log(req.body.password, loggedUser[0].password);
    const match = await bcrypt.compare(req.body.password, loggedUser[0].password);
    if (!match)
        return res.status(401).send("Email or Password is incorrect !");
    
    const httpOnlyCookie = {
        email: loggedUser[0].email,
        role: loggedUser[0].role,
        user_id: loggedUser[0].user_id,
    }
    const loggedUserToken = jwt.sign(httpOnlyCookie, process.env.APP_SECRET, {
        expiresIn: '24h'
    })
    return res.cookie('accessToken', loggedUserToken, {
        maxAge: 24 * 60 * 60 * 100,
        httpOnly: true,
        secure: false
    }).send(httpOnlyCookie);
}


async function logout(req, res, next) {
    res.clearCookie('accessToken');
    return res.status(200).send('Cookie cleared')
}

module.exports = {
    logout,
    login,
    signUpSysAdmin,
    signUpEmployee
};