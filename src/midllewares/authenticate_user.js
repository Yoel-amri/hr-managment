const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const userToken = req.cookies['accessToken'];
    if (!userToken) return res.status(401).send("You're not logged in, please log in !");
    jwt.verify(userToken, process.env.APP_SECRET, (err, user) => {
        if (err) return res.status(403).send("Token expired or is not verified, please login !");
        if (user.role !== 'EMPLOYEE') return res.status(403).send("Users roles conflict");
        req.user = user;
        next();
    })
}

module.exports = {
    authenticateUser
}