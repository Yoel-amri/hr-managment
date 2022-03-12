CREATE TYPE roles AS ENUM ('SYSTEM_ADMIN', 'ADMIN', 'EMPLOYEE');
CREATE TYPE inviteStatus AS ENUM ('WAITING', 'ACCEPTED', 'REFUSED');

CREATE TABLE users (
	firstname VARCHAR(50),
	lastname VARCHAR(50),
	user_id VARCHAR ( 50 ) PRIMARY KEY,
	password VARCHAR ( 255 ),
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on 	TIMESTAMP DEFAULT Now(),
    role		roles NOT NULL,
    invitation  inviteStatus NOT NULL,
	employee_number SERIAL,
	phone_number VARCHAR(20),
	address VARCHAR (50),
	birthday DATE,
	profile_image VARCHAR (50),
	remarks VARCHAR (100),
	postal_code VARCHAR(10),
	department VARCHAR(10)
);

CREATE TABLE company (
	company_id VARCHAR ( 50 ) PRIMARY KEY,
    company_name VARCHAR(50),
	address VARCHAR(50),
	postal_code VARCHAR(10),
	phone_number VARCHAR(20),
	website VARCHAR(50),
	date_creation DATE,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on 	TIMESTAMP  DEFAULT Now(),
	created_by 	VARCHAR(50) REFERENCES users,
	profile_image VARCHAR (50),
);

CREATE TABLE employee_company (
    company_id  VARCHAR (50) REFERENCES company,
    user_id     VARCHAR (50) REFERENCES users UNIQUE,
    CONSTRAINT  PK_user_company PRIMARY KEY (company_id, user_id)
);

select (C.company_name, U.role, U.firstname +' '+ U.lastname as username, U.email, U.user_id) from users U , employee_company EC, company C where U.id = EC.user_id and EC.company_id = C.company_id and C.company_id='25235' and U.email = 'ewrgewrg' and U.role = 'dveverg' 

