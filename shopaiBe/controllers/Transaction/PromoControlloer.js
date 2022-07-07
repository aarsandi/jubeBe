const { Sequelize, Promo, PromoUser, UserEprescription } = require("../../models/index");
const Op = Sequelize.Op;

class PromoControlloer {
    static async browse(req, res, next) {
        try {
            const datauser = req.decoded
            const Op = Sequelize.Op;
            const { isActive = "" , search = "", claimed = "" } = req.query
            let query = {}
            if(search){
                query.promoDesc = { [Op.iLike]: `%${search}%` }
            }
            if(isActive == 'true') {
                query.expiredDate = {
                    [Op.or]: [
                        { [Op.gte]: new Date() }, { [Op.eq]: null }
                    ]
                }
            }
            if (isActive == 'false'){
                query.expiredDate = { [Op.lte]: new Date() }
            }
            if(claimed == 'true') {
                query['$PromoUsers.id$'] = {
                    [Op.ne]: null
                }
            }
            if (claimed == 'false'){
                query['$PromoUsers.id$'] = null
            }

            const result = await Promo.findAll({
                where: {
                    ...query,
                    isActive: true
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                raw: true,
                include: [
                    {
                        model: PromoUser,
                        required: false,
                        where: {
                            UserEprescriptionId: datauser.id,
                        },
                        attributes: ['id','amountUsed']
                    },
                ],
                attributes: { exclude: ['updatedAt', 'isActive'] }
            })
            if(result) {
                let resultAPI = []
                if(claimed=="true") {
                    resultAPI = result.filter(el => {
                        if(el.isCoupon == true){
                            if(el['PromoUsers.amountUsed']>0){
                                return false
                            }else{
                                return true
                            }
                        }else{
                            return true
                        }
                    })
                }else{
                    resultAPI = result
                }
                res.status(200).json({
                    message: "success",
                    data: resultAPI
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
            const id = req.params.id;
            const result = await Promo.findOne({
                where: { id, isActive: true },
                attributes: { exclude: ['updatedAt', 'isActive'] }
            })
            if(result) {
                res.status(200).json({
                    message: "success",
                    data: result
                })
            }else{
                res.status(404).json({ message: "data promo not found or inactive" })
            }
        } catch(err) {
            next(err)
        }        
    }

    static async claim(req, res, next) {
        try {
            const { id = null, promo_code = "" } = req.body
            const datauser = req.decoded
            let field = null;
            let search = "";

            if(id) {
                field = "id";
                search = id;
            }else if(promo_code) {
                field = "promoDesc";
                search = promo_code;
            }else{
                res.status(404).json({ message: "params required" });
            }

            const result = await Promo.findOne({
                where: {
                    [field]: { [Op.eq]: search },
                    isActive: true,
                },
                attributes: { exclude: ['updatedAt'] }
            })
            if(result) {
                var date = new Date();
                if(result.expiredDate===null||date<result.expiredDate) {
                    const userFind = await UserEprescription.findByPk(datauser.id)
                    const resultClaim = await userFind.addPromo(result, { through: { amountUsed: 0 } });
                    if(resultClaim) {
                        res.status(200).json({
                            message: "success claim promo",
                            data: result
                        })
                    }else{
                        res.status(400).json({
                            message: "this promo has been claimed"
                        })
                    }
                }else{
                    res.status(404).json({
                        message: "promo expired"
                    })
                }
            }else{
                res.status(404).json({ message: "promo not found" })
            }
        } catch(err) {
            next(err)
        }        
    }
}

module.exports = PromoControlloer
