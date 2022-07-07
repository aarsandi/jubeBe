const { checkPass, hashPassword } = require("../../helpers/bcrypt");
const { UserEprescription } = require("../../models/index");

class DoctorController {
    static async browse(req, res, next) {
        let { page = 1, limit = 10 } = req.query
        
        UserEprescription.findAll({
            offset: (page - 1) * limit, limit: limit,
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: { exclude: ['password', 'updatedAt'] }
        }).then(async function (result) {
            const { count } = await UserEprescription.findAndCountAll()

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

    static async profile(req, res, next) {
        try {
            let userId = req.decoded.id;
            let userData = await UserEprescription.findOne({ where: { id: userId }, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
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
        const { fullname, address } = req.body;
        UserEprescription.findByPk(id).then((user) => {
            if (user) {
                user.update({ fullname, address }).then((el) => {
                    if(el) {
                        res.status(200).json({
                            message: "success",
                            data: {
                                fullname: el.fullname,
                                address: el.address
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
        UserEprescription.findByPk(id).then((user) => {
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
        UserEprescription.findByPk(id).then((user) => {
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