const { phoneFormater } = require("../../helpers/others");
const { Patient, UserEprescription, Sequelize } = require("../../models/index");
const { setUserNotificiation } = require("../../helpers/firebase");
const moment = require('moment')

class PatientController {
    static async addPatient(req, res, next) {
        try {
            const { nik, fullname, berat, tinggi, tensi, dob, gender, saturasi, suhu, phoneNumber, allergic = "", address, addressGeo } = req.body;
            const dataDoctor = req.decoded
            // find unique doctor patient by name
            const findPatient = await Patient.findOne({ where: { fullname: fullname, UserDoctorId: dataDoctor.id } });

            if(findPatient) {
                res.status(400).json({ message: "this patient already exist", data: findPatient });
            }else{
                let userData = await UserEprescription.findOne({ where: { phoneNumber: phoneFormater(phoneNumber) } });
                let refCode = ''
                if(!userData) {
                    const genPassword = Math.random().toString(36).slice(-8);
                    const userCreate = await UserEprescription.create({
                        username: '-',
                        email: '',
                        password: genPassword,
                        fullname,
                        phoneNumber,
                        referalCode: '',
                        userVerification: true,
                        address,
                        addressGeo,
                        avatar: ''
                    })

                    const genUsername = `${fullname.split(" ")[0].replace(/[^a-z0-9]/gmi, "").replace(/\s+/g, "")}_${userCreate.id}`;
                    
                    const genRefCode = Math.random().toString(36).slice(-10).toUpperCase();                    
                    refCode = genRefCode+userCreate.id
                    userCreate.set({
                        username: genUsername,
                        referalCode: refCode
                    });
                    await userCreate.save();
                    userData = userCreate.dataValues
                }
                const generateDate = moment(new Date()).format("YYYYMMDD");
                
                const newPatient = await Patient.create({
                    UserEprescriptionId: userData.id, UserDoctorId: dataDoctor.id,
                    nik, fullname, berat, tinggi, tensi, dob, 
                    gender, saturasi, suhu, allergic, regNumber: `NOP${generateDate}${userData.id}`
                })

                setUserNotificiation({
                    userId: dataDoctor.id,
                    title: "new patient has been added",
                    message: `new patient has been added`,
                    category: "patient",
                    role: 'user_doctor'
                })
                
                res.status(201).json({ message: "success", data: newPatient });
            }
        } catch (err) {
            next(err);
        }
    }

    static async browse(req, res, next) {
        try {
            const Op = Sequelize.Op;
            let { page = 1, limit = 20, search , searchBy = "fullname" } = req.query
            const dataDoctor = req.decoded
            let query = {
                UserDoctorId: dataDoctor.id
            }

            if(search&&searchBy) {
                const whitelist = ["fullname","nik"];
                if(whitelist.includes(searchBy)){
                    query[searchBy] = { [Op.iLike]: `%${search}%` }
                }else{
                    res.status(400).json({ message: "search by value mismatch, expected fullname or nik" });
                }
            }

            const result = await Patient.findAll({
                where: query,
                offset: (page - 1) * limit, limit: limit,
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: ['id', 'fullname', 'dob', 'regNumber'],
                include: [
                    { model: UserEprescription, attributes: ['referalCode', 'username', 'phoneNumber', 'address', 'addressGeo'] }
                ]
            })

            if(result) {
                const countData = await Patient.findAndCountAll({
                    where: query,
                })
                let hasPrevPage;
                let hasNextPage;
                let totalPages = Math.ceil(countData.count / limit)
    
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
                    totalDocs: countData.count,
                    totalPages,
                    page: Number(page),
                    limit: Number(limit),
                    hasPrevPage,
                    hasNextPage,
                })
            }else{
                res.status(404).json({ message: "data not found" })
            }
        } catch(err) {
            next(err)
        }
    }

    static async read(req, res, next) {
        try {
            const dataDoctor = req.decoded
            const patientId = req.params.id;
            const result = await Patient.findOne({
                where: {
                    UserDoctorId: dataDoctor.id,
                    id: patientId
                },
                attributes: {exclude: ['updatedAt','UserEprescriptionId', 'UserDoctorId']},
                include: [
                    { model: UserEprescription, attributes: ['referalCode', 'username', 'phoneNumber', 'address', 'addressGeo'] }
                ]
            })
            res.status(200).json({
                message: "success",
                data: result
            })
        } catch(err) {
            next(err)
        }
    }
}

module.exports = PatientController