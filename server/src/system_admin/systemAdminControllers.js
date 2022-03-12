const {
  users,
  employee_company,
  company,
} = require("../services/schema/types");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../lib/emails/mailer");
const { hashPassword } = require("../lib/hashPassword");
const { query } = require("../services/dbConnection");
var fs = require("fs");

async function createEmployee(req, res, next) {
  const userData = { ...req.body, user_id: uuidv4() };
  console.log("dkhol");
  try {
    await users.createOne({
      data: {
        user_id: userData.user_id,
        email: userData.email,
        role: userData.role,
        invitation: "WAITING",
      },
    });
    await employee_company.createOne({
      data: {
        company_id: userData.company_id,
        user_id: userData.user_id,
      },
    });
  } catch (e) {
    return next(e);
  }
  try {
    const token = jwt.sign(userData, process.env.APP_SECRET);
    console.log(`${process.env.APP_HOSTNAME}/api/users/signUp/${token}`);
    // await sendMail(userData.email, token, `${process.env.APP_HOSTNAME}/api/users/signUp/${token}`);
  } catch (e) {
    return res.status(500).send("Failed to send email");
  }
  return res.status(201).send(userData);
}

async function createSysAdmin(req, res, next) {
  const userData = { ...req.body, user_id: uuidv4() };
  try {
    await users.createOne({
      data: {
        user_id: userData.user_id,
        email: userData.email,
        role: userData.role,
        invitation: "WAITING",
      },
    });

  } catch (e) {
    return next(e);
  }
  try {
    const token = jwt.sign(userData, process.env.APP_SECRET);
    console.log(
      `${process.env.APP_HOSTNAME}/api/users/signUp/system_admin/${token}`
    );
    // await sendMail(userData.email, token, `${process.env.APP_HOSTNAME}/api/users/signUp/system_admin/${token}`);
  } catch (e) {
    return res.status(400).send("user created but failed to send email");
  }
  return res.status(200).send(userData);
}

async function createCompany(req, res, next) {
  // console.log(await hashPassword("password"))
  const companyInfo = {
    company_id: uuidv4(),
    ...req.body,
  };
  try {
    await company.createOne({
      data: {
        company_id: companyInfo.company_id,
        company_name: companyInfo.company_name,
        address: companyInfo.address,
        postal_code: companyInfo.postal_code,
        phone_number: companyInfo.phone_number,
        email: companyInfo.email,
        website: companyInfo.website,
        date_creation: companyInfo.date_creation,
        created_by: req.user.user_id,
      },
    });
    res.status(201).send(companyInfo);
  } catch (e) {
    next(e);
  }
}

async function getAllCompanies(req, res, next) {
  try {
    const companies = await query("SELECT * FROM company");
    return res.status(200).send(companies);
  } catch (e) {
    return next(e);
  }
}

async function updateCompanyInfo(req, res, next) {
  const companyInfo = { ...req.body };
  try {
    await company.update({
      data: {
        company_name: companyInfo.company_name,
        address: companyInfo.address,
        postal_code: companyInfo.postal_code,
        phone_number: companyInfo.phone_number,
        email: companyInfo.email,
        website: companyInfo.website,
        date_creation: companyInfo.date_creation,
      },
      where: {
        company_id: companyInfo.company_id,
      },
    });
    return res.status(200).send(companyInfo);
  } catch (e) {
    return next(e);
  }
}

async function findUsers(req, res, next) {
  const searchFilter = req.body;
  if (searchFilter.company_id) {
    await employee_company.findMany({
      where: {
        company_id: searchFilter.company_id,
      },
    });
  }
}

async function updateEmployee(req, res, next) {
  try {
    const userData = req.body;
  await users.update({
    data: {
      firstname: userData.firstname,
      lastname: userData.lastname,
      department: userData.department,
      phone_number: userData.phone_number,
      address: userData.address,
      postal_code: userData.postal_code,
      remarks: userData.remarks,
      birthday: userData.birthday,
      email:  userData.email
    },
    where: {
      user_id: userData.user_id,
    },
  });
  res.status(200).send(userData);
  } catch (e) {
    return next(e);
  }
}

async function findEmployees(req, res, next) {
  const company_id = req.query.company_id;
  const role = req.query.role;
  const email = req.query.email;

  let sqlVariables = [];
  let sqlVariableIndex = 1;

  try {
    let sqlQuery = `select C.company_name, U.role, U.firstname, U.lastname, U.email, U.user_id from users U , employee_company EC, company C where U.user_id = EC.user_id and EC.company_id = C.company_id`;
    if (role) {
      sqlQuery += ` and U.role=$${sqlVariableIndex}`;
      sqlVariableIndex += 1;
      sqlVariables = [role];
    }
    if (email) {
      sqlQuery += ` and U.email=$${sqlVariableIndex}`;
      sqlVariableIndex += 1;
      sqlVariables = [...sqlVariables, email];
    }
    if (company_id) {
      sqlQuery += ` and C.company_id=$${sqlVariableIndex}`;
      sqlVariables = [...sqlVariables, company_id];
    }

    const users = await query(sqlQuery, sqlVariables);
    return res.status(200).send(users);
  } catch (e) {
    return next(e);
  }
}

async function getEmployeeInfo(req, res, next) {
  try {
    const user_id = req.query.user_id;
    const userData = await users.findMany({
      where: {
        user_id: user_id,
      },
      select: {
        firstname: true,
        lastname: true,
        user_id: true,
        email: true,
        role: true,
        department: true,
        phone_number: true,
        address: true,
        postal_code: true,
        birthday: true,
        remarks: true,
        invitation: true,
        profile_image: true,
      },
    });
    return res.status(200).send(userData);
  } catch (e) {
    return next(e);
  }
}

async function updateEmployeeProfileImage(req, res, next) {
  try {
    const userData = { ...req.body };
    await users.update({
      data: {
        profile_image: req.imageName,
      },
      where: {
        user_id: userData.user_id,
      },
    });
    console.log(userData);
    return res.status(200).send({profile_image: req.imageName});
  } catch (e) {
    return next(e);
  }
}

async function updateCompanyProfileImage(req, res, next) {
  try {
    const companyData = req.body;
    await company.update({
      data: {
        profile_image: req.imageName,
      },
      where: {
        company_id: companyData.company_id,
      },
    });
    console.log(req.imageName);
    res.status(201).send({
      profile_image: req.imageName,
    });
  } catch (e) {
    return next(e);
  }
}

async function getInvitations(req, res, next) {
  try {
    let sqlQuery = `select C.company_name, U.role, U.firstname, U.lastname, U.email, U.user_id, U.invitation from users U , employee_company EC, company C where U.user_id = EC.user_id and EC.company_id = C.company_id`;
    const users = await query(sqlQuery);
    return res.status(200).send(users);
  } catch (e) {
    return next(e);
  }
}

async function cancelInvite(req, res, next) {
  const userToCancel = { ...req.body };
  try {
    let user = await users.findMany({
      where: {
        user_id: userToCancel.user_id,
      }
    })
    if (user[0].invitation === 'ACCEPTED')
      return res.status(403).send('Cant cancel user!');
    await users.update({
      data: {
        invitation: "REFUSED",
      },
      where: {
        user_id: userToCancel.user_id,
      },
    });
    return res.status(200).send(userToCancel);
  } catch (e) {
    return next();
  }
}

module.exports = {
  cancelInvite,
  getInvitations,
  updateCompanyProfileImage,
  updateEmployeeProfileImage,
  getEmployeeInfo,
  findUsers,
  updateEmployee,
  findEmployees,
  updateCompanyInfo,
  getAllCompanies,
  createEmployee,
  createSysAdmin,
  createCompany,
};
