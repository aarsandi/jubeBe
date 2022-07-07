
let { verifyToken } = require("../helpers/jwt");
const { UserDoctor, UserEprescription } = require("../models/index")

const AuthenticationPublic = (req, res, next) => {
    let token = req.headers.token ? req.headers.token : null
    verifyToken(token, async (err, decoded) => {
        if (err) {
            next(err)
        } else if (decoded) {
            let user = await UserEprescription.findOne({ where: { id: decoded.id } })
            if (!user) {
                res.status(401).json({ message: "Not Authorized" });
            } else if(!user.userVerification) {
                res.status(401).json({ message: "Sorry, Email has not been verified. Please check your email to verify it" });
            } else{
                req.decoded = decoded;
                next();
            }
        }else{
            next({ status: 401, message: `You must login first as public` });
        }
    })
}
const AuthenticationDoctor = (req, res, next) => {
    let token = req.headers.token ? req.headers.token : null
    verifyToken(token, async (err, decoded) => {
        if (err) {
            next(err)
        } else if (decoded) {
            let user = await UserDoctor.findOne({ where: { id: decoded.id } })
            if (!user) {
                res.status(401).json({ message: "Not Authorized" });
            } else if(!user.userVerification) {
                res.status(401).json({ message: "Sorry, Email has not been verified. Please check your email to verify it" });
            } else if(!user.isApproved) {
                res.status(401).json({ message: "Sorry, your account has not been approved, Please wait till admin approve it" });
            } else{
                req.decoded = decoded;
                next();
            }
        }else{
            next({ status: 401, message: `You must login first as doctor` });
        }
    })
}


module.exports = {
    AuthenticationDoctor, AuthenticationPublic
}