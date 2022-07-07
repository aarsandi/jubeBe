const jwt = require('jsonwebtoken')

function generateToken(payload, expires=0) {
    if(Number(expires)) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: Number(expires) })
    }else{
        return jwt.sign(payload, process.env.JWT_SECRET)
    }
}

function verifyToken(token, cb) {
    return jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, decoded);
        }
    });
}

module.exports = {
    verifyToken, generateToken
};