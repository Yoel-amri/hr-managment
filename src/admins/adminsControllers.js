const { employee_company, company } = require("../services/schema/types");
const { v4: uuidv4 } = require("uuid");
const { users } = require("../services/schema/types");
const jwt = require("jsonwebtoken");
const { query } = require("../services/dbConnection");
const {sendMail} = require('../lib/emails/mailer');

async function inviteEmployee(req, res, next) {
  const userData = { ...req.body, user_id: uuidv4() };
  try {
    const logged_user_id = req.user.user_id;

    const company = await employee_company.findMany({
      where: {
        user_id: logged_user_id,
      },
    });
    if (userData.role === 'SYSTEM_ADMIN')
      return res.status(401).send('You can set a system_admin !');
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
        company_id: company[0].company_id,
        user_id: userData.user_id,
      },
    });
    try {
      const token = jwt.sign(userData, process.env.APP_SECRET, {
        expiresIn: '24h'
      });
      await sendMail(userData.email, 'click here', `${process.env.APP_HOSTNAME}/signUp?token=${token}`);

    } catch (e) {
      return res.status(500).send("Failed to send email");
    }
    return res.status(201).send(userData);
  } catch (e) {
    return next(e);
  }
}

async function updateCompany(req, res, next) {
  try {
    const company_data = { ...req.body };
    const own_company = await employee_company.findMany({
      where: {
        user_id: req.user.user_id,
      },
    });

    await company.update({
      data: {
        company_name: company_data.company_name,
        address: company_data.address,
        postal_code: company_data.postal_code,
        phone_number: company_data.phone_number,
        email: company_data.email,
        website: company_data.website,
        date_creation: company_data.date_creation,
      },
      where: {
        company_id: own_company[0].company_id,
      },
    });
    return res.status(200).send(company_data);
  } catch (e) {
    return next(e);
  }
}

async function updateCompanyImage(req, res, next) {
  try {
    const adminCompany = await employee_company.findMany({
      where: {
        user_id: req.user.user_id,
      },
    });
    await company.update({
      data: {
        profile_image: req.imageName,
      },
      where: {
        company_id: adminCompany[0].company_id,
      },
    });
    return res.status(200).send({profile_image: req.imageName});
  } catch (e) {
    return next(e);
  }
}

async function updateEmployeeInfo(req, res, next) {
  const userToUpdate = { ...req.body };
  try {
    let loggedAdminCompany = await employee_company.findMany({
      where: {
        user_id: req.user.user_id,
      },
    });
    loggedAdminCompany = loggedAdminCompany[0].company_id;
    const userCompany = await employee_company.findMany({
      where: {
        user_id: userToUpdate.user_id,
      },
    });
    if (userCompany[0].company_id !== loggedAdminCompany)
      return res.status(403).send("User doesnt exist in you company! ");

    await users.update({
      data: {
        firstname: userToUpdate.firstname,
        lastname: userToUpdate.lastname,
        department: userToUpdate.department,
        phone_number: userToUpdate.phone_number,
        address: userToUpdate.address,
        postal_code: userToUpdate.postal_code,
        remarks: userToUpdate.remarks,
        birthday: userToUpdate.birthday,
      },
      where: {
        user_id: userToUpdate.user_id,
      },
    });
    return res.status(200).send(userToUpdate);
  } catch (e) {
    return next(e);
  }
}

async function updateProfileImage(req, res, next) {
  const userToUpdate = { ...req.body };

  try {
    let loggedAdminCompany = await employee_company.findMany({
      where: {
        user_id: req.user.user_id,
      },
    });
    loggedAdminCompany = loggedAdminCompany[0].company_id;
    const userCompany = await employee_company.findMany({
      where: {
        user_id: userToUpdate.user_id,
      },
    });
    if (userCompany[0].company_id !== loggedAdminCompany)
      return res.status(403).send("User doesnt exist in you company! ");
    await users.update({
      data: {
        profile_image: req.imageName,
      },
      where: {
        user_id: userToUpdate.user_id,
      },
    });
    return res.status(200).send({profile_image: req.imageName});
  } catch (e) {
    next(e);
  }
}

async function getInvitations(req, res, next) {
  try {
    const adminCompany = await employee_company.findMany({
      where: {
        user_id: req.user.user_id,
      },
    });
    const company_id = adminCompany[0].company_id;
    let sqlQuery = `select U.invitation, C.company_name, U.role, U.firstname, U.lastname, U.email, U.user_id from users U , employee_company EC, company C where U.user_id = EC.user_id and EC.company_id = C.company_id`;
    sqlQuery += ` and C.company_id = $1`;

    const users = await query(sqlQuery, [company_id]);
    return res.status(200).send(users);
  } catch (e) {
    return next(e);
  }
}

async function cancelInvite(req, res, next) {
  const userToCancel = { ...req.body };
  try {
    let loggedAdminCompany = await employee_company.findMany({
      where: {
        user_id: req.user.user_id,
      },
    });
    loggedAdminCompany = loggedAdminCompany[0].company_id;
    const userCompany = await employee_company.findMany({
      where: {
        user_id: userToCancel.user_id,
      },
    });
    if (userCompany[0].company_id !== loggedAdminCompany)
      return res.status(403).send("User doesnt exist in you company! ");
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
    return next(e);
  }
}

async function getEmployeeInfo(req, res, next) {
  const user_id = req.query.user_id;
  try {
    let loggedAdminCompany = await employee_company.findMany({
      where: {
        user_id: req.user.user_id,
      },
    });
    loggedAdminCompany = loggedAdminCompany[0].company_id;
    const userCompany = await employee_company.findMany({
      where: {
        user_id: user_id,
      },
    });
    if (userCompany[0].company_id !== loggedAdminCompany)
      return res.status(403).send("User doesnt exist in you company! ");

    const userInfo = await users.findMany({
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
      where: {
        user_id: user_id,
      },
    });
    return res.status(200).send(userInfo);
  } catch (e) {
    return next(e);
  }
}

async function findEmployees(req, res, next) {
  const role = req.query.role;
  const email = req.query.email;

  let sqlVariables = [];
  let sqlVariableIndex = 1;

  try {
    let company_id = await employee_company.findMany({
      where: {
        user_id: req.user.user_id
      }
    })
    company_id = company_id[0].company_id;
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

async function  getOwnCompany(req,res,next) {
  try {
    let company_id = await employee_company.findMany({
      where: {
        user_id: req.user.user_id
      }
    })
    company_id = company_id[0].company_id;
    const companyInfo = await company.findMany({
      where: {
        company_id: company_id,
      }
    })
    return res.status(200).send(companyInfo[0]);
  } catch (e) {
    return next(e)
  }
}

module.exports = {
  getOwnCompany,
  findEmployees,
  getEmployeeInfo,
  cancelInvite,
  getInvitations,
  updateProfileImage,
  updateEmployeeInfo,
  updateCompanyImage,
  updateCompany,
  inviteEmployee,
};
