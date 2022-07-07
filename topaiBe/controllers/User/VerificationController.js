
const { UserEprescription, UserDoctor } = require("../../models/index");
let { verifyToken } = require("../../helpers/jwt");
const { setAdminNotificiation } = require('../../helpers/firebase')

class VerificationController {
    static async verifyUser(req, res, next) {
        try {
            let token = req.params.jwttoken;
            verifyToken(token, async (err, result) => {
                if (err) {
                    next(err)
                } else {
                    if(result) {
                        if(result.type==="public") {
                            const userFind = await UserEprescription.findByPk(result.id)
                            if(userFind) {
                                if(userFind.userVerification) {
                                    return res.status(401).json({ message: "akun ini sudah terverifikasi" });
                                }else{
                                    userFind.update({ userVerification: true })
                                    return res.status(200).json({ message: "berhasil verifikasi user, redirect to login" });
                                }
                            }else{
                                return res.status(404).json({ message: "akun tidak ditemukan atau url expired" });
                            }
                        }else if(result.type==="doctor"){
                            const doctorFind = await UserDoctor.findByPk(result.id)
                            if(doctorFind) {
                                if(doctorFind.userVerification) {
                                    return res.status(401).json({ message: "akun ini sudah terverifikasi" });
                                }else{
                                    doctorFind.update({ userVerification: true })
                                    setAdminNotificiation({
                                        role: "AdminV",
                                        title: "new doctor has been added",
                                        message: `${doctorFind.fullname} waiting to be approved`,
                                        category: "user_doctor"
                                    })
                                    return res.status(200).json({ message: "berhasil verifikasi email, akun anda akan di approve oleh admin, dan akan ada notifikasi email setelah di approve" });
                                }
                            }else{
                                return res.status(404).json({ message: "akun tidak ditemukan atau url expired" });
                            }
                        }else{
                            return res.status(500).json({ message: "user type wrong value" });
                        }
                    }
                }
            });
        } catch (err) {
            next(err)
        }
    }
}

module.exports = VerificationController
