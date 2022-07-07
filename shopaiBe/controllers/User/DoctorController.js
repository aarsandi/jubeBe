const { hashPassword, checkPass } = require("../../helpers/bcrypt");
const { UserDoctor } = require("../../models/index");

class DoctorController {
    static async browse(req, res, next) {
        let { page = 1, limit = 10 } = req.query
        
        UserDoctor.findAll({
            offset: (page - 1) * limit, limit: limit,
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: { exclude: ['password', 'updatedAt'] }
        }).then(async function (result) {
            const { count } = await UserDoctor.findAndCountAll()

            let hasPrevPage;
            let hasNextPage;
            let totalPages = Math.ceil(count / limit)

            if (result.length === 0) {
                hasNextPage = null
                hasPrevPage = null
            } else {
                if (Number(page) === 1 && totalPages === 1) {
                    hasNextPage = false
                    hasPrevPage = false
                } else if (Number(page) === 1 && totalPages >= 1) {
                    hasNextPage = true
                    hasPrevPage = false
                } else if (Number(page) === totalPages) {
                    hasNextPage = false
                    hasPrevPage = true
                } else {
                    hasNextPage = true
                    hasPrevPage = true
                }
            }
            res.status(200).json({
                message: "success",
                result,
                totalDocs: result.length,
                totalPages,
                page: Number(page),
                limit: Number(limit),
                hasPrevPage,
                hasNextPage,
            })
        }).catch(next);
    }

    static async approveDoctor(req, res, next) {
        try {
            const id = req.params.id;
            let { status = '' } = req.query
            if(status) {
                const doctorFind = await UserDoctor.findByPk(id)
                if(doctorFind) {
                    if(doctorFind.isApproved) {
                        return res.status(200).json({ message: "akun ini sudah diproses" });
                    }else{
                        const genPassword = Math.random().toString(36).slice(-8);
                        const hashPw = hashPassword(genPassword)
                        const genUsername = `${doctorFind.email.split("@")[0].replace(/[^a-z0-9]/gmi, "").replace(/\s+/g, "")}_${doctorFind.id}`;
                        if(status == 'approved') {
                            doctorFind.update({ isApproved: status, username: genUsername, password: hashPw })
                        }else{
                            doctorFind.destroy();
                        }
                        req.payload = {
                            id: doctorFind.id,
                            fullname: doctorFind.fullname,
                            username: genUsername,
                            email: doctorFind.email,
                            status: status=='approved'?'approved':'rejected',
                            password: genPassword
                        };
                        next();
                    }
                }else{
                    return res.status(404).json({ message: "data not found" });
                }
            }else{
                return res.status(400).json({ message: "param status required" });
            }
        } catch(err) {
            next(err);
        }
    }

    static async profile(req, res, next) {
        try {
            let userId = req.decoded.id;
            let userData = await UserDoctor.findOne({ where: { id: userId }, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
            res.status(200).json({
                message: "success",
                data: userData,
            })
        } catch (err) {
            next(err)
        }
    }

    static edit(req, res, next) {
        let id = req.decoded.id;
        const { fullname, practice_address } = req.body;
        UserDoctor.findByPk(id).then((user) => {
            if (user) {
                user.update({ fullname: fullname, practiceAddress: practice_address }).then((el) => {
                    if(el) {
                        res.status(200).json({
                            message: "success",
                            data: {
                                fullname: el.fullname,
                                practice_address: el.practiceAddress
                            }
                        });
                    }else{
                        res.status(404).json({ message: "user not found" });
                    }
                }).catch(next);                  
            }else{
                res.status(404).json({ message: "user not found" });
            }
        }).catch(next);
    }

    static setting(req, res, next) {
        let id = req.decoded.id;
        const { language, push_notification, dark_theme } = req.body;
        UserDoctor.findByPk(id).then((user) => {
            if (user) {
                user.update({ language, pushNotification: push_notification, darkTheme: dark_theme }).then((el) => {
                    if(el) {
                        res.status(200).json({
                            message: "success",
                            data: {
                                language: el.language,
                                push_notification: el.pushNotification,
                                dark_theme: el.darkTheme
                            }
                        });
                    }else{
                        res.status(404).json({ message: "user not found" });
                    }
                }).catch(next);
            }else{
                res.status(404).json({ message: "user not found" });
            }
        }).catch(next);
    }

    static changePassword(req, res, next) {
        const id = req.decoded.id;
        const { password, new_password } = req.body;
        UserDoctor.findByPk(id).then((user) => {
            if (user) {
                if(password === new_password){
                    res.status(400).json({
                        message:"new password cannot be same with old password!",
                        status:400
                    })
                }else{
                    if (checkPass(password, user.password)) {
                        user.update({ password: hashPassword(new_password) }).then((el) => {
                            res.status(200).json({ message: "success" });
                        }).catch(next);
                    } else {
                        res.status(400).json({ message: "your password is wrong" });
                    }
                }
            }else{
                res.status(404).json({ message: "user not found" });
            }
        }).catch(next);
    }
}

module.exports = DoctorController