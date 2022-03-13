var nodemailer = require('nodemailer');

const mail = {
    service: 'gmail',
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
};

var account = nodemailer.createTransport(mail);

async function sendMail(email, message, url) {
    let options = {
        "from": '"hrmanagmentapp" <hrmanagmentapp@gmail.ma>',
        "to": email,
        "html": `<a href='http://${url}'>${message}</a> to sign up with us`
    };
    try {
        await account.sendMail(options); 
    } catch (e) {
        console.log(e)
        throw new Error("failed to send email")
    }
}

module.exports = {
    sendMail
}