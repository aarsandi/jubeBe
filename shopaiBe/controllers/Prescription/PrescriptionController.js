const {
    Prescription, Concoction, PrescriptionItem, UserEprescription, ConcoctionItem,
    Item, Patient, sequelize, Sequelize, MasterItem_dropdown, ItemStockInfo, ItemConversionUnit, ItemStockWarehouse
} = require("../../models/index");
const { setUserNotificiation, setAdminNotificiation } = require("../../helpers/firebase");
const Op = Sequelize.Op;

class PrescriptionController {
    static async browse(req, res, next) {
        try {
            let { page = 1, limit = 20 } = req.query
            const dataDoctor = req.decoded

            const result = await Prescription.findAll({
                attributes: {
                    exclude: ['administration','pharmaceutical','clinical','verification','drugRelatedProblem']
                },
                where: { UserDoctorId: dataDoctor.id },
                offset: (page - 1) * limit, limit: limit,
                order: [
                    ['createdAt','DESC']
                ],
                include: [
                    {
                        model: PrescriptionItem, attributes: ['frequency','doseQty','orderQty','price','subTotal','unit'],
                        include: [{
                            model: Item, attributes: ['itemName','fileImg','itemCode']
                        }]
                    },
                    {
                        model: Patient, attributes: ['regNumber','fullname','dob','gender']
                    },
                    {
                        model: Concoction, attributes: ['name','price','frequency','doseQty','qtyInText','qty','optional','status'],
                        include: [{
                            model: ConcoctionItem, attributes: ['dose','unit','price','subTotal'],
                            include: [{
                                model: Item, attributes: ['itemName','fileImg','itemCode']
                            }]
                        }]
                    }
                ]
            })

            if(result) {
                let countData = await Prescription.findAndCountAll({
                    where: { UserDoctorId: dataDoctor.id }
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
                    data: result,
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
            let prescriptionId = req.params.id;
            let prescriptionData = await Prescription.findOne({
                where: { id: prescriptionId },
                attributes: { exclude: ['updatedAt'] },
                include: [
                    {
                        model: PrescriptionItem, attributes: ['frequency','doseQty','orderQty','price','subTotal','unit'],
                        include: [{
                            model: Item, attributes: ['itemName','fileImg','itemCode']
                        }]
                    },
                    {
                        model: Patient, attributes: ['regNumber','fullname','dob','gender']
                    },
                    {
                        model: Concoction, attributes: ['name','price','frequency','doseQty','qtyInText','qty','optional','status'],
                        include: [{
                            model: ConcoctionItem, attributes: ['dose','unit','price','subTotal'],
                            include: [{
                                model: Item, attributes: ['itemName','fileImg','itemCode']
                            }]
                        }]
                    }
                ]
            })
            res.status(200).json({
                message: "success",
                data: prescriptionData,
            })
        } catch (err) {
            next(err)
        }
    }
    
    static async create(req, res, next) {
        const {
            items, concoction, PatientId, administration, pharmaceutical, clinical, verification, drugRelatedProblem,
            instructionFeedback, notes
        } = req.body

        const dataDoctor = req.decoded
        const t = await sequelize.transaction();
        try {
            let totalPrice = 0;
            let concoctionArr = []
            // looping concoction
            const findUser = await Patient.findByPk(PatientId)
            if(findUser) {
                if(findUser.UserDoctorId !== dataDoctor.id) {
                    throw new Error('This account doesnt have that data patient');
                }
                for await (let concoctionEl of concoction) {
                    let resConcoction = {
                        name: concoctionEl.name,
                        price: 0,
                        frequency: concoctionEl.frequency,
                        doseQty: concoctionEl.doseQty,
                        qtyInText: concoctionEl.qtyInText,
                        qty: concoctionEl.qty,
                        optional: concoctionEl.optional,
                        status: 'CREATED',
                        concoctionItems: []
                    }
                    for await (let item of concoctionEl.items) {
                        let findItem = await Item.findOne({
                            where: { id: item.ItemId },
                            attributes: { exclude: ['updatedAt'] },
                            include: [
                                {
                                    model: ItemStockWarehouse, attributes: ['id','ItemId', 'qty', 'expiredDate'],
                                    required: false,
                                    where: {
                                        // id warehousenya yang harian
                                        warehouseId: 3,
                                        expiredDate: {
                                            [Op.or]: [
                                                { [Op.gte]: new Date() }, { [Op.eq]: null }
                                            ]
                                        },
                                        qty: {
                                            [Op.gt]: 0
                                        }
                                    },
                                },
                                { model: MasterItem_dropdown },
                                { model: ItemConversionUnit }
                            ],
                        });
                        if(findItem){
                            let dataTemp = findItem.toJSON();
                            if(dataTemp.ItemStockWarehouses.length) {
                                dataTemp.totalQty = dataTemp.ItemStockWarehouses.reduce( function(a, b) {
                                    return a + b.qty;
                                }, 0);
                            }else{
                                throw new Error('item stock is empty');
                            }
                            if(item.doseQty<=dataTemp.totalQty) {
                                let result = {
                                    ItemId: dataTemp.id,
                                    unitId: dataTemp.unitId,
                                    unit: dataTemp.MasterItem_dropdown?dataTemp.MasterItem_dropdown.value:item.unit,
                                    price: dataTemp.hja,
                                    subTotal: dataTemp.hja*item.doseQty,
                                    dose: item.doseQty
                                }
                                resConcoction.concoctionItems.push(result)
                                resConcoction.price += result.subTotal
                            }else{
                                throw new Error('item stock is not enough');
                            }
                        }else{
                            throw new Error('item is not found');
                        }
                    }
                    totalPrice += resConcoction.price
                    concoctionArr.push(resConcoction)
                }
                // looping item
                let itemArr = []
                for await (let item of items) {
                    let findItem = await Item.findOne({
                        where: { id: item.ItemId },
                        attributes: { exclude: ['updatedAt'] },
                        include: [
                            {
                                model: ItemStockWarehouse, attributes: ['id','ItemId', 'qty', 'expiredDate'],
                                required: false,
                                where: {
                                    // id warehousenya yang harian
                                    warehouseId: 3,
                                    expiredDate: {
                                        [Op.or]: [
                                            { [Op.gte]: new Date() }, { [Op.eq]: null }
                                        ]
                                    },
                                    qty: {
                                        [Op.gt]: 0
                                    }
                                },
                            },
                            { model: MasterItem_dropdown },
                            { model: ItemConversionUnit }
                        ]
                    });
                    if(findItem) {
                        let dataTemp = findItem.toJSON();
                        if(dataTemp.ItemStockWarehouses.length) {
                            dataTemp.totalQty = dataTemp.ItemStockWarehouses.reduce( function(a, b) {
                                return a + b.qty;
                            }, 0);
                        }else{
                            throw new Error('item stock is empty');
                        }
                        if(item.doseQty<=dataTemp.totalQty) {
                            if(item.UnitConversionId){
                                let conversionFind = dataTemp.ItemConversionUnits.find(el => el.id === item.UnitConversionId)
                                if(conversionFind) {
                                    let result = {
                                        ItemId: dataTemp.id,
                                        ItemConversionUnitId: conversionFind.id,
                                        frequency: item.frequency,
                                        doseQty: item.doseQty,
                                        orderQty: item.orderQty*conversionFind.qtyKonversi,
                                        price: conversionFind.price,
                                        subTotal: conversionFind.price*(item.orderQty*conversionFind.qtyKonversi),
                                        unit: conversionFind.nameUnit
                                    }
                                    itemArr.push(result)
                                    totalPrice += result.subTotal
                                }else{
                                    throw new Error('item conversion is not found');
                                }
                            }else{
                                let result = {
                                    ItemId: dataTemp.id,
                                    ItemConversionUnitId: item.UnitConversionId,
                                    frequency: item.frequency,
                                    doseQty: item.doseQty,
                                    orderQty: item.orderQty,
                                    price: dataTemp.hja,
                                    subTotal: dataTemp.hja*item.orderQty,
                                    unit: dataTemp.MasterItem_dropdown?dataTemp.MasterItem_dropdown.value:item.unit
                                }
                                itemArr.push(result)
                                totalPrice += result.subTotal
                            }
                        }else{
                            throw new Error('item stock is not enough');
                        }
                    }else{                    
                        throw new Error('item not found');
                    }
                }

                // generate dueDate 1 day
                let genTimeNow = new Date()
                let genDueDate = new Date(genTimeNow.getTime() + (24 * 3600000));
                
                const prescript = await Prescription.create({
                    UserDoctorId: dataDoctor.id, PatientId,
                    administration, pharmaceutical,
                    clinical, verification, drugRelatedProblem, instructionFeedback, notes, totalPrice,
                    comment: "",
                    status: 'CREATED',
                    orderDueDate: genDueDate,
                    adminRoute: ''
                }, { transaction: t })

                if(prescript) {
                    for await (let item of concoctionArr) {
                        const createdConcoction = await Concoction.create({
                            PrescriptionId: prescript.id,
                            name: item.name,
                            price: item.price,
                            frequency: item.frequency,
                            doseQty: item.doseQty,
                            qtyInText: item.qtyInText,
                            qty: item.qty,
                            optional: item.optional,
                            status: 'CREATED'
                        }, { transaction: t })
                        const concoctionItemArr = item.concoctionItems.map( value => {
                            value.ConcoctionId = createdConcoction.id
                            return value
                        });
                        await ConcoctionItem.bulkCreate(concoctionItemArr, { transaction: t })
                    }
        
                    const inputEpresItem = itemArr.map( value => {
                        value.PrescriptionId = prescript.id
                        return value
                    });
                    await PrescriptionItem.bulkCreate(inputEpresItem, { transaction: t })    
                    await t.commit();
                    
                    setUserNotificiation({
                        userId: findUser.UserEprescriptionId,
                        title: "new prescription has been added",
                        message: `new prescription has been added`,
                        category: "prescription",
                        role: 'user_public'
                    })
                    
                    setAdminNotificiation({
                        role: "AdminV",
                        title: "new prescription has been added",
                        message: "new prescription has been added",
                        category: "prescription"
                    })
                    res.status(201).json({ message: "success" });
                }else{
                    throw new Error('input eprescription error');
                }
            }else{
                throw new Error('patient not found');
            }
        } catch(err) {
            await t.rollback();
            if(err.name == "SequelizeForeignKeyConstraintError") {
                if(err.table === "ConcoctionItems"||err.table === "PrescriptionItems") {
                    res.status(404).json({message: "data item not found"});
                }else if(err.table === "Prescriptions") {
                    res.status(404).json({message: "data patient not found"});
                }else{
                    next(err)
                }
            }else{
                next(err)
            }
        }
    }
}

module.exports = PrescriptionController