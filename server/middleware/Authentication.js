const jwt = require('jsonwebtoken');
const ResponseObject = require('../models/ResponseObject')

const auth = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader ? authorizationHeader.split(" ")[1] : null;

    if (token === null) {
        return res.status(403).json(ResponseObject(403, 'Forbidden'))
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, data) => {
            if (err) return res.status(403).json(ResponseObject(403, 'Forbidden'))
            req.userId = data._id;
            next();
        })
    }


}

module.exports = auth;