const { checkPass, hashPassword } = require("../../helpers/bcrypt");
const { generateToken } = require("../../helpers/jwt");
const { UserEprescription, UserDoctor, Patient, sequelize } = require("../../models/index");
const { uploadSIP } = require("../../helpers/firebase")

class AuthController {
    static async registerPublic(req, res, next) {
        try {
            const { username, password, email, address, addressGeo, phoneNumber, fullname } = req.body;
            const findUser = await UserEprescription.findOne({ where: { email: email } });
            if(!findUser) {
                const findUserName = await UserEprescription.findOne({ where: { username: username } });
                if(!findUserName) {
                    const userCreate = await UserEprescription.create({
                        username, email, password, fullname, phoneNumber,
                        address, userVerification: false, addressGeo, referalCode: '',
                        avatar: ''
                    })
                    
                    if(userCreate) {
                        req.payload = {
                            id: userCreate.id,
                            fullname: fullname,
                            username: username,
                            email: email,
                            type: "public"
                        };
                        next();
                    }else{
                        res.status(500).json({ message: "Internal Server Error" });
                    }
                }else{
                    res.status(400).json({ message: "Username already exists" });
                }
            }else{
                res.status(400).json({ message: "Email already exists" });
            }
        } catch (err) {
            next(err);
        }
    }

    static async registerDoctor(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { email, phoneNumber, fullname, practiceAddress, practiceAddressGeo, sipNumber } = req.body;
            const findUser = await UserDoctor.findOne({ where: { email: email } });
            if(req.file) {
                if(!findUser) {         
                    const userCreate = await UserDoctor.create({
                        email, phoneNumber, fullname, practiceAddress, practiceAddressGeo,
                        document: '-', sipNumber, avatar: ''
                    }, { transaction: t })
                    const fileUpload = await uploadSIP(req.file, 'sip')
                    if(fileUpload.cloudStoragePublicUrl) {
                        userCreate.document = fileUpload.cloudStoragePublicUrl
                        await userCreate.save({transaction: t});
                        req.payload = {
                            id: userCreate.id,
                            fullname: fullname,
                            username: '',
                            email: email,
                            type: "doctor"
                        };
                        await t.commit();
                        next();
                    } else {
                        throw new Error('upload file document failed, cloudStoragePublicUrl not found');
                    }
                }else{
                    throw new Error('Email already exists');
                }
            }else{
                throw new Error('document SIP required');
            }
        } catch(err) {
            await t.rollback();
            next(err)
        }
    }

    static loginDoctor(req, res, next) {
        const { username, password } = req.body;
        if (username && password) {
            UserDoctor.findOne({ where: { username: username } })
                .then((user) => {
                    if (user && !user.userVerification) {
                        return res.status(403).json({ message: "Sorry, Email has not been verified. Please check your email to verify it" });
                    } else if (user && !user.isApproved) {
                        return res.status(403).json({ message: "Sorry, account has not been approved. Please check email or wait until admin approve it" });
                    } else if (user && user.isApproved == 'rejected') {
                        return res.status(403).json({ message: "Sorry, account has been rejected." });
                    } else if (user && user.userVerification && user.isApproved) {
                        if (!checkPass(password, user.password)) {
                            res.status(400).json({ message: `Sorry your password is wrong. try again with another password` });
                        } else {
                            let token = generateToken({
                                id: user.id,
                                fullname: user.fullname,
                                username: user.username,
                                email: user.email,
                                type: "doctor"
                            }, 604800);
                            res.status(200).json({
                                message: "success",
                                data: {
                                    id: user.id,
                                    fullname: user.fullname,
                                    email: user.email,
                                    avatar: user.avatar,
                                    language: user.language,
                                    darkTheme: user.darkTheme,
                                    phoneNumber: user.phoneNumber
                                },
                                token: token
                            });
                        }
                    } else {
                        res.status(404).json({ message: "Unregistered username" });
                    }
            }).catch(next);
        } else {
            res.status(404).json({ message: "username & password cannot be empty" });
        }
    }

    static loginPublic(req, res, next) {
        const { username, password } = req.body;
        if (username && password) {
            UserEprescription.findOne({ where: { username: username } })
                .then((user) => {
                    if (user && !user.userVerification) {
                        return res.status(403).json({ message: "Sorry, Email has not been verified. Please check your email to verify it" });
                    } else if (user && user.userVerification) {
                        if (!checkPass(password, user.password)) {
                            res.status(400).json({ message: `Sorry your password is wrong. try again with another password` });
                        } else {
                            let token = generateToken({
                                id: user.id,
                                fullname: user.fullname,
                                username: user.username,
                                email: user.email,
                                type: "public"
                            }, 604800);
                            res.status(200).json({
                                message: "success",
                                data: {
                                    id: user.id,
                                    fullname: user.fullname,
                                    email: user.email,
                                    avatar: user.avatar,
                                    language: user.language,
                                    darkTheme: user.darkTheme,
                                    phoneNumber: user.phoneNumber
                                },
                                token: token
                            });
                        }
                    } else {
                        res.status(404).json({ message: "Unregistered username" });
                    }
            }).catch(next);
        } else {
            res.status(404).json({ message: "Username & password cannot be empty" });
        }
    }

    static loginDoctorMobile(req, res, next) {
        const { username, password } = req.body;
        if (username && password) {
            UserDoctor.findOne({ where: { username: username } })
                .then((user) => {
                    if (user && !user.userVerification) {
                        return res.status(403).json({ message: "Sorry, Email has not been verified. Please check your email to verify it" });
                    } else if (user && !user.isApproved) {
                        return res.status(403).json({ message: "Sorry, account has not been approved. Please check email or wait until admin approve it" });
                    } else if (user && user.isApproved == 'rejected') {
                        return res.status(403).json({ message: "Sorry, account has been rejected." });
                    } else if (user && user.userVerification && user.isApproved) {
                        if (!checkPass(password, user.password)) {
                            res.status(400).json({ message: `Sorry your password is wrong. try again with another password` });
                        } else {
                            let token = generateToken({
                                id: user.id,
                                fullname: user.fullname,
                                username: user.username,
                                email: user.email,
                                type: "doctor"
                            });
                            res.status(200).json({
                                message: "success",
                                data: {
                                    id: user.id,
                                    fullname: user.fullname,
                                    email: user.email,
                                    avatar: user.avatar,
                                    language: user.language,
                                    darkTheme: user.darkTheme,
                                    phoneNumber: user.phoneNumber
                                },
                                token: token
                            });
                        }
                    } else {
                        res.status(404).json({ message: "Unregistered username" });
                    }
            }).catch(next);
        } else {
            res.status(404).json({ message: "username & password cannot be empty" });
        }
    }

    static loginPublicMobile(req, res, next) {
        const { username, password } = req.body;
        if (username && password) {
            UserEprescription.findOne({ where: { username: username } })
                .then((user) => {
                    if (user && !user.userVerification) {
                        return res.status(403).json({ message: "Sorry, Email has not been verified. Please check your email to verify it" });
                    } else if (user && user.userVerification) {
                        if (!checkPass(password, user.password)) {
                            res.status(400).json({ message: `Sorry your password is wrong. try again with another password` });
                        } else {
                            let token = generateToken({
                                id: user.id,
                                fullname: user.fullname,
                                username: user.username,
                                email: user.email,
                                type: "public"
                            });
                            res.status(200).json({
                                message: "success",
                                data: {
                                    id: user.id,
                                    fullname: user.fullname,
                                    email: user.email,
                                    avatar: user.avatar,
                                    language: user.language,
                                    darkTheme: user.darkTheme,
                                    phoneNumber: user.phoneNumber
                                },
                                token: token
                            });
                        }
                    } else {
                        res.status(404).json({ message: "Unregistered username" });
                    }
            }).catch(next);
        } else {
            res.status(404).json({ message: "Username & password cannot be empty" });
        }
    }

    static forgetPasswordPublic(req, res, next) {
        const { email } = req.body;
        if (email) {
            UserEprescription.findOne({ where: { email: email } })
            .then((user) => {
                if (user) {
                    const genPassword = Math.random().toString(36).slice(-8);
                    const hashPw = hashPassword(genPassword)
                    user.update({ password: hashPw })
                    req.payload = {
                        id: user.id,
                        fullname: user.fullname,
                        email: user.email,
                        password: genPassword
                    };
                    next();
                } else {
                    res.status(404).json({ message: "Unregistered email" });
                }
            }).catch(next);
        }else{
            res.status(404).json({ message: "email cannot be empty" });
        }
    }

    static forgetPasswordDoctor(req, res, next) {
        const { email } = req.body;
        if (email) {
            UserDoctor.findOne({ where: { email: email } })
            .then((user) => {
                if (user && !user.isApproved) {
                    return res.status(403).json({ message: "Sorry, account has not been approved. Please check email or wait until admin approve it" });
                } else if (user && user.isApproved == 'rejected') {
                    return res.status(403).json({ message: "Sorry, account has been rejected." });
                } else if(user && user.isApproved) {
                    const genPassword = Math.random().toString(36).slice(-8);
                    const hashPw = hashPassword(genPassword)
                    user.update({ password: hashPw })
                    req.payload = {
                        id: user.id,
                        fullname: user.fullname,
                        email: user.email,
                        password: genPassword
                    };
                    next();
                } else {
                    res.status(404).json({ message: "Unregistered email" });
                }
            }).catch(next);
        }else{
            res.status(404).json({ message: "email cannot be empty" });
        }
    }

    static async loginByRefCode(req, res, next) {
        const { refCode } = req.body;
        try {
            const findData = await UserEprescription.findOne({
                where: { referalCode: refCode },
                raw : true ,
                nest : true
            })
            if(findData) {
                let token = generateToken({
                    id: findData.id,
                    fullname: findData.fullname,
                    username: findData.username,
                    email: findData.email,
                    type: "public"
                }, 86400);
                res.status(200).json({
                    message: "success",
                    data: {
                        id: findData.id,
                        fullname: findData.fullname,
                        email: findData.email,
                        avatar: findData.avatar,
                        language: findData.language,
                        darkTheme: findData.darkTheme,
                        phoneNumber: findData.phoneNumber
                    },
                    token: token
                });
            }else{
                res.status(404).json({
                    message: "refcode not found",
                    data: null,
                    token: null
                })
            }
        } catch(err) {
            next(err)
        }
    }

    static async loginByRefCodeMobile(req, res, next) {
        const { refCode } = req.body;
        try {
            const findData = await UserEprescription.findOne({
                where: { referalCode: refCode },
                raw : true ,
                nest : true
            })
            if(findData) {
                let token = generateToken({
                    id: findData.id,
                    fullname: findData.fullname,
                    username: findData.username,
                    email: findData.email,
                    type: "public"
                });
                res.status(200).json({
                    message: "success",
                    data: {
                        id: findData.id,
                        fullname: findData.fullname,
                        email: findData.email,
                        avatar: findData.avatar,
                        language: findData.language,
                        darkTheme: findData.darkTheme,
                        phoneNumber: findData.phoneNumber
                    },
                    token: token
                });
            }else{
                res.status(404).json({
                    message: "refcode not found",
                    data: null,
                    token: null
                })
            }
        } catch(err) {
            next(err)
        }
    }
}

module.exports = AuthController