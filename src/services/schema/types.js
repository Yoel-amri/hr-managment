const {databaseModel} = require("../databaseSchema");

const usersColumns = [
    'user_id',
    'password',
    'email',
    'created_on',
    'role',
];

const companyColumns = [
    'company_id',
    'company_name',
    'address',
    'postal_code',
    'phone_number',
    'website',
    'date_creation',
    'email',
    'created_on',
    'created_by'
]

const employee_companyColumns = [
    'company_id',
    'user_id',
]

class Users extends databaseModel {
    constructor() {
        super(usersColumns, 'users');
    }
}

class Company extends databaseModel {
    constructor() {
        super(companyColumns, 'company');
    }
}

class EmployeeCompany extends databaseModel {
    constructor() {
        super(employee_companyColumns, 'employee_company');
    }
}

const users = new Users();
const company = new Company();
const employee_company = new EmployeeCompany();

module.exports = {
   users,
   company,
   employee_company,
}