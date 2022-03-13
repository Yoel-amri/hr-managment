const { users, employee_company, company } = require("../services/schema/types")

async function updateInfo(req, res, next) {
    const userData = {...req.body}
    try {
        await users.update({
            where: {
                user_id: req.user.user_id
            },
            data: {
                firstname: userData.firstname,
                lastname: userData.lastname,
                department: userData.department,
                phone_number: userData.phone_number,
                address: userData.address,
                postal_code: userData.postal_code,
                remarks: userData.remarks,
            }
        })
        await res.status(201).send(userData)
    } catch (e) {
        return next(e);
    }
}

async function updateProfileImage(req, res, next) {
    try {
        await users.update({
            data: {
                profile_image: req.imageName
            },
            where: {
                user_id: req.user.user_id
            }
        })
        return res.status(200).send({profile_image: req.imageName});
    } catch (e) {
        return next()
    }
}

async function getMyInfo(req, res, next) {
    try {
        const userData = await users.findMany({
            where: {
                user_id: req.user.user_id
            }
        })
        delete userData[0].password
        return res.status(200).send(userData);
    } catch (e) {
        return  next(e)
    }
}

async function getCompany(req, res, next) {
    try {
        let employeCompanyId = await employee_company.findMany({
            where: {
                user_id: req.user.user_id
            }
        })
        employeCompanyId = employeCompanyId[0].company_id
        const companyInfo = await company.findMany({
            where: {
                company_id: employeCompanyId
            }
        })  
        return res.status(200).send(companyInfo[0]);
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    getCompany,
    getMyInfo,
    updateInfo,
    updateProfileImage,
}