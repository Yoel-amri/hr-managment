const jwt = require('jsonwebtoken');

const authenticateSysAdmin = (req, res, next) => {
    const userToken = req.cookies['accessToken'];
    if (!userToken) return res.status(401).send("You're not logged in, please log in !");
    jwt.verify(userToken, process.env.APP_SECRET, (err, user) => {
        if (err) return res.status(403).send("Token expired or is not verified, please login !");
        if (user.role !== 'SYSTEM_ADMIN') return res.status(403).send("Token expired or is not valid, please login !");
        req.user = user;
        next();
    })
}

module.exports = {
    authenticateSysAdmin
}