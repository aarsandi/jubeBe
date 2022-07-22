const {
    Sequelize, sequelize, UserEprescription, PrescriptionItem, ConcoctionItem, Prescription, Patient, Item, Concoction,
    Order, ItemMedicineInfo, ItemKomposisiInfo, OrderItem, OrderConcoction, Promo, PromoUser,
    ItemConversionUnit, MasterItem_dropdown, ItemStockWarehouse
} = require("../../models/index");

const { itemStockChange } = require("../../helpers/webhook");

const tax_order = process.env.TAX_ORDER;
const percentage = `${Number(tax_order)*100}%`;
const Op = Sequelize.Op;
const moment = require('moment');

class OrderController {
    static async browse(req, res, next) {
        try {
            const datauser = req.decoded
            const result = await Order.findAll({
                where: {
                    UserEprescriptionId: datauser.id
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: { exclude: ['updatedAt'] },
                include: [
                    { model: OrderItem, attributes: { exclude: ['updatedAt'] } },
                    { model: OrderConcoction, attributes: { exclude: ['updatedAt'] } },
                ]
            })
            if(result.length) {
                res.status(200).json({ message: "success", data: result })
            }else{
                res.status(404).json({ message: "data not found", data: null })
            }
        } catch(err) {
            next(err)
        }
    }

    static async read(req, res, next) {
        try {
            const datauser = req.decoded
            const itemId = req.params.id;
            const result = await Order.findOne({
                where: {
                    id: itemId,
                    UserEprescriptionId: datauser.id
                },
                attributes: { exclude: ['updatedAt'] },
                include: [
                    { model: OrderItem, attributes: { exclude: ['updatedAt'] } },
                    { model: OrderConcoction, attributes: { exclude: ['updatedAt'] } },
                ]
            })

            if(result) {
                let resultJson = result.toJSON();
                res.status(200).json({
                    message: "success",
                    data: resultJson
                })
            }else{
                res.status(404).json({
                    message: "data not found",
                    data: null
                })
            }

            res.status(200).json({ message: "success", data: result })
        } catch(err) {
            next(err)
        }
    }

    static async orderPublic(req, res, next) {
        const dataUser = req.decoded
        const { items, pickup_method, promo_id } = req.body
        const t = await sequelize.transaction();
        try {
            const checkUser = await UserEprescription.findByPk(dataUser.id);
            if(checkUser) {
                // create doc order
                let reducedItemsTemp = [];
                let totalPrice = 0;
                let totalAmount = 0;
                
                let resItems = [];
                for (let i = 0; i < items.length; i++) {
                    let findItem = await Item.findOne({
                        where: { id: items[i].ItemId },
                        attributes: { exclude: ['updatedAt'] },
                        include: [
                            { model: MasterItem_dropdown },
                            { model: ItemStockWarehouse, attributes: ['id','ItemId', 'qty', 'expiredDate'],
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
                            { model: ItemConversionUnit }
                        ],
                        order: [
                            [sequelize.models.ItemStockWarehouse, 'expiredDate', 'ASC']
                        ],
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
                        if(items[i].UnitConversionId) {
                            let conversionFind = dataTemp.ItemConversionUnits.filter(el => el.id === items[i].UnitConversionId)
                            if(conversionFind.length) {
                                let qtyReal = items[i].qty*conversionFind[0].qtyKonversi
                                if(dataTemp.totalQty >= qtyReal) {
                                    const findIndex = reducedItemsTemp.findIndex(el => {
                                        return el.ItemId === dataTemp.id;
                                    });
                                    if(findIndex >= 0) {
                                        reducedItemsTemp[findIndex].reducedQty = reducedItemsTemp[findIndex].reducedQty + qtyReal;
                                    }else{                                        
                                        reducedItemsTemp.push({
                                            ItemId: dataTemp.id,
                                            reducedQty: qtyReal
                                        })
                                    }
                                    
                                    // perhitungan total tax dan price
                                    let priceTax = Math.ceil(Number(tax_order)*Number(conversionFind[0].price))
                                    let subTotalPrice = conversionFind[0].price*items[i].qty
                                    let tax_cost = priceTax*items[i].qty
                                    let subTotalAmount = (conversionFind[0].price+priceTax)*items[i].qty
                                    resItems = [...resItems, {
                                        ItemId: dataTemp.id,
                                        price: conversionFind[0].price,
                                        subtotalPrice: subTotalPrice,
                                        subTotalAmount: subTotalAmount,
                                        tax_amount: tax_cost,
                                        qtyUnit: items[i].qty,
                                        unit: conversionFind[0].nameUnit
                                    }]
                                    totalPrice += Number(subTotalPrice)
                                    totalAmount += Number(subTotalAmount)
                                }else{
                                    throw new Error('item stock is not enough');
                                }
                            }else{
                                throw new Error('conversion data not found');
                            }
                        }else{
                            if(dataTemp.totalQty >= items[i].qty) {
                                const findIndex = reducedItemsTemp.findIndex(el => {
                                    return el.ItemId === dataTemp.id;
                                });
                                if(findIndex >= 0) {
                                    reducedItemsTemp[findIndex].reducedQty = reducedItemsTemp[findIndex].reducedQty + items[i].qty;
                                }else{                                        
                                    reducedItemsTemp.push({
                                        ItemId: dataTemp.id,
                                        reducedQty: items[i].qty
                                    })
                                }
                                
                                // perhitungan total tax dan price
                                let priceTax = Math.ceil(Number(tax_order)*Number(dataTemp.hja))
                                let subTotalPrice = dataTemp.hja*items[i].qty
                                let tax_cost = priceTax*items[i].qty
                                let subTotalAmount = (dataTemp.hja+priceTax)*items[i].qty
                                resItems = [...resItems, {
                                    ItemId: dataTemp.id,
                                    price: dataTemp.hja,
                                    subtotalPrice: subTotalPrice,
                                    subTotalAmount: subTotalAmount,
                                    tax_amount: tax_cost,
                                    qtyUnit: items[i].qty,
                                    unit: dataTemp.MasterItem_dropdown?dataTemp.MasterItem_dropdown.value:items[i].unit
                                }]
                                totalPrice += Number(subTotalPrice)
                                totalAmount += Number(subTotalAmount)
                            }else{
                                throw new Error('item stock is not enough');
                            }
                        }
                    }else{
                        throw new Error('data not found');
                    }
                }

                const resStockChange = [];
                for await (let item of reducedItemsTemp) {
                    const findStockWarehouse = await ItemStockWarehouse.findAll({where: { ItemId:item.ItemId, warehouseId: 3, qty: { [Op.gt]: 0 } }})
                    if(findStockWarehouse.length) {

                        await findStockWarehouse[0].increment({qty: -item.reducedQty}, { transaction:t });

                        // let qtyRealRemaining = item.reducedQty || 0;
                        // for await (let itemStock of findStockWarehouse) {
                        //     let qtyRemain = qtyRealRemaining - itemStock.qty
                        //     if(qtyRemain>0) {
                        //         await itemStock.update({qty: 0}, { transaction:t });                                
                        //         resReducedStock.push({
                        //             ItemId: item.ItemId,
                        //             ItemStockWarehouseId : itemStock.id,
                        //             reducedQty: itemStock.qty
                        //         })
                        //         qtyRealRemaining -= item.qty
                        //     } else {
                        //         await itemStock.update({qty: itemStock.qty-qtyRealRemaining}, { transaction:t });
                        //         resReducedStock.push({
                        //             ItemId: item.ItemId,
                        //             ItemStockWarehouseId : itemStock.id,
                        //             reducedQty: qtyRealRemaining
                        //         })
                        //         break
                        //     }
                        // }

                        resStockChange.push({
                            action: 'stock_decrement',
                            ItemId: item.ItemId,
                            qty: item.reducedQty
                        })
                    }else{
                        throw new Error('item stock is empty');
                    }
                }

                // generate refid and dueDate 1 day
                let genTimeNow = new Date()
                const generateRefId = `${genTimeNow.getTime()}${checkUser.id}`;                
                let genDueDate = new Date(genTimeNow.getTime() + (24 * 3600000));

                // create order doc
                const createOrder = await Order.create({
                    UserEprescriptionId: dataUser.id,
                    orderRefNumber: `Tx${generateRefId}`,
                    pickupMethod: pickup_method,
                    orderType: "public",
                    ttlItemPrice: totalPrice,
                    ttlAmount: totalAmount,
                    ttlItem: items.length,
                    paymentDueDate: genDueDate,
                    comment: "",
                    address: {
                        fullname: checkUser.fullname,
                        address: checkUser.address,
                        phoneNumber: checkUser.phoneNumber,
                        addressGeo: checkUser.addressGeo
                    },
                    status: "UNPAID",
                    stockReduce: "resReducedStock"
                }, { transaction: t }
                )

                const resOrderItem = resItems.map(el => ({...el, OrderId: createOrder.id}))
                await OrderItem.bulkCreate(resOrderItem, { transaction: t })

                // stok array yang berkurang
                itemStockChange(resStockChange)

                await t.commit();

                res.status(201).json({
                    message: "success",
                    data: createOrder.id
                })
            }else{
                await t.rollback();
                res.status(404).json({
                    message: "user not found"
                })
            }
        } catch(err) {
            await t.rollback();
            next(err)
        }
    }

    static async orderPrescription(req, res, next) {
        const dataUser = req.decoded
        const { pickup_method, PrescriptionId, promo_id } = req.body
        const t = await sequelize.transaction();
        try {
            const checkUser = await UserEprescription.findOne({ where: { id: dataUser.id }, raw: true });
            
            if(checkUser) {
                // check promo user dan expirednya
                let dataPromo = null;
                if(promo_id) {
                    const checkPromo = await PromoUser.findOne({
                        where: {
                            id: promo_id,
                            UserEprescriptionId: dataUser.id,                            
                        },
                        include: [
                            {
                                model: Promo,
                                where: {
                                    isActive: true,
                                    expiredDate : {
                                        [Op.or]: [
                                            { [Op.gte]: new Date() }, { [Op.eq]: null }
                                        ]
                                    }
                                },
                            },
                        ],
                        attributes: ['id','amountUsed']
                    });
                    if(checkPromo) {
                        if(checkPromo.Promo.isCoupon == true){
                            if(checkPromo.amountUsed>0){
                                throw new Error('promo data already used');
                            }else{
                                dataPromo = checkPromo.toJSON()
                            }
                        }else{
                            dataPromo = checkPromo.toJSON()
                        }
                    }else{
                        throw new Error('promo data not found');
                    }
                }
                // console.log(dataPromo, "data promo")

                const prescriptionData = await Prescription.findOne({
                    where: {
                        id: PrescriptionId,
                        '$Patient.UserEprescriptionId$': { [Op.eq]: dataUser.id }
                    },
                    attributes: { exclude: ['updatedAt'] },
                    include: [
                        {
                            model: PrescriptionItem,
                            attributes: { exclude: ['createdAt', 'updatedAt', 'PrescriptionId'] },
                            include: [
                                { model: Item },
                                { model: ItemConversionUnit }
                            ]
                        },
                        { model: Patient },
                        {
                            model: Concoction,
                            attributes: { exclude: ['createdAt', 'updatedAt', 'PrescriptionId'] },
                            include: {
                                model: ConcoctionItem,
                                attributes: { exclude: ['createdAt', 'updatedAt', 'ConcoctionId'] },
                                include: { model: Item }
                            }
                        }
                    ]
                })
                
                if(prescriptionData) {
                    if(prescriptionData.status==="CREATED") {
                        const prescriptionObj = prescriptionData.toJSON()
                        let reducedItemsTemp = [];
                        let dataConcoctions = prescriptionObj.Concoctions                        
                        let dataItems = prescriptionObj.PrescriptionItems
                        let itemsLength = dataItems.length + dataConcoctions.length
                        let totalPrice = 0;
                        let totalAmount = 0;

                        // disini looping item jalan kurangi stok ,hitung tax, hitung subtotal dan cek stok
                        const resItems = [];
                        for (let i = 0; i < dataItems.length; i++) {
                            let findItem = await Item.findOne({
                                where: { id: dataItems[i].ItemId },
                                attributes: { exclude: ['updatedAt'] },
                                include: [
                                    { model: MasterItem_dropdown },
                                    { model: ItemStockWarehouse, attributes: ['id','ItemId', 'qty', 'expiredDate'],
                                        required: false,
                                        where: {
                                            // id warehosenya yang harian
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
                                    { model: ItemConversionUnit }
                                ],
                                order: [
                                    [sequelize.models.ItemStockWarehouse, 'expiredDate', 'ASC']
                                ],
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
                                let qtyReal= dataItems[i].ItemConversionUnit?dataItems[i].ItemConversionUnit.qtyKonversi*dataItems[i].orderQty:dataItems[i].orderQty
                                if(dataTemp.totalQty >= qtyReal) {
                                    // masukin ke variabel reducedItemsTemp
                                    const findIndex = reducedItemsTemp.findIndex(el => {
                                        return el.ItemId === dataTemp.id;
                                    });
                                    if(findIndex >= 0) {
                                        reducedItemsTemp[findIndex].reducedQty = reducedItemsTemp[findIndex].reducedQty + qtyReal;
                                    }else{                                        
                                        reducedItemsTemp.push({
                                            ItemId: dataTemp.id,
                                            reducedQty: qtyReal
                                        })
                                    }
                                    // buat data res dan hitung tax price dan total
                                    let priceTax = Math.ceil(Number(tax_order)*Number(dataItems[i].price))
                                    let subTotalPrice = dataItems[i].subTotal
                                    let tax_cost = priceTax*dataItems[i].orderQty
                                    let subTotalAmount = (dataItems[i].price+priceTax)*dataItems[i].orderQty
                                    resItems.push({
                                        ItemId: dataTemp.id,
                                        price: dataItems[i].price,
                                        subtotalPrice: subTotalPrice,
                                        subTotalAmount: subTotalAmount,
                                        tax_amount: tax_cost,
                                        qtyUnit: dataItems[i].orderQty,
                                        qtyUnit: dataItems[i].orderQty,
                                        unit: dataItems[i].unit
                                    })
                                    totalPrice += Number(subTotalPrice)
                                    totalAmount += Number(subTotalAmount)
                                }else{
                                    throw new Error('item stock is not enough');
                                }
                            }else{
                                throw new Error('data not found');
                            }
                        }

                        // disini hitung price total serta tax
                        const resConcoctions = [];
                        for (let i = 0; i < dataConcoctions.length; i++) {
                            let priceTax = Math.ceil(Number(tax_order)*Number(dataConcoctions[i].price))
                            let subTotalPrice = dataConcoctions[i].price
                            let tax_cost = priceTax
                            let subTotalAmount = dataConcoctions[i].price+priceTax
                            resConcoctions.push({
                                ConcoctionId: dataConcoctions[i].id,
                                price: dataConcoctions[i].price,
                                subtotalPrice: subTotalPrice,
                                subTotalAmount: subTotalAmount,
                                tax_amount: tax_cost,
                                qtyUnit: dataConcoctions[i].qty,
                                unit: dataConcoctions[i].optional
                            })
                            totalPrice += Number(subTotalPrice)
                            totalAmount += Number(subTotalAmount)
                            
                            for await (let el of dataConcoctions[i].ConcoctionItems) {
                                let findItem = await Item.findOne({
                                    where: { id: el.ItemId },
                                    attributes: { exclude: ['updatedAt'] },
                                    include: [
                                        { model: MasterItem_dropdown },
                                        { model: ItemStockWarehouse, attributes: ['id','ItemId', 'qty', 'expiredDate'],
                                            required: false,
                                            where: {
                                                // id warehosenya yang harian
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
                                        { model: ItemConversionUnit }
                                    ],
                                    order: [
                                        [sequelize.models.ItemStockWarehouse, 'expiredDate', 'ASC']
                                    ],
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
                                    let qtyReal= el.dose
                                    if(dataTemp.totalQty >= qtyReal) {
                                        // masukin ke variabel reducedItemsTemp
                                        const findIndex = reducedItemsTemp.findIndex(el => {
                                            return el.ItemId === dataTemp.id;
                                        });
                                        if(findIndex >= 0) {
                                            reducedItemsTemp[findIndex].reducedQty = reducedItemsTemp[findIndex].reducedQty + qtyReal;
                                        }else{
                                            reducedItemsTemp.push({
                                                ItemId: dataTemp.id,
                                                reducedQty: qtyReal
                                            })
                                        }
                                    }else{
                                        throw new Error('item stock is not enough');
                                    }
                                }else{
                                    throw new Error('data not found');
                                }
                            }
                        }

                        const resReducedStock = [];
                        for await (let item of reducedItemsTemp) {
                            const findStockWarehouse = await ItemStockWarehouse.findAll({where: { ItemId:item.ItemId, warehouseId: 3, qty: { [Op.gt]: 0 } }})
                            if(findStockWarehouse.length) {
                                let qtyRealRemaining = item.reducedQty || 0;
                                for await (let itemStock of findStockWarehouse) {
                                    let qtyRemain = qtyRealRemaining - itemStock.qty
                                    if(qtyRemain>0) {
                                        await itemStock.update({qty: 0}, { transaction:t });                                        
                                        resReducedStock.push({
                                            ItemId: item.ItemId,
                                            ItemStockWarehouseId : itemStock.id,
                                            reducedQty: itemStock.qty
                                        })
                                        qtyRealRemaining -= item.qty
                                    } else {
                                        await itemStock.update({qty: itemStock.qty-qtyRealRemaining}, { transaction:t });
                                        resReducedStock.push({
                                            ItemId: item.ItemId,
                                            ItemStockWarehouseId : itemStock.id,
                                            reducedQty: qtyRealRemaining
                                        })
                                        break
                                    }
                                }
                            }else{
                                throw new Error('item stock is empty');
                            }
                        }
                        
                        // gen refId dan due date 1 day
                        let genTimeNow = new Date()
                        const generateRefId = `${genTimeNow.getTime()}${checkUser.id}`;                
                        let genDueDate = new Date(genTimeNow.getTime() + (24 * 3600000));

                        const createOrder = await Order.create({
                            UserEprescriptionId: dataUser.id,
                            PrescriptionId: prescriptionObj.id,
                            orderRefNumber: `Tx${generateRefId}`,
                            pickupMethod: pickup_method,
                            orderType: "prescript",
                            ttlItemPrice: totalPrice,
                            ttlAmount: totalAmount,
                            ttlItem: itemsLength,
                            paymentDueDate: genDueDate,
                            comment: "",
                            address: {
                                fullname: checkUser.fullname,
                                address: checkUser.address,
                                phoneNumber: checkUser.phoneNumber,
                                addressGeo: checkUser.addressGeo
                            },
                            status: "UNPAID",
                            stockReduce: resReducedStock
                        }, { transaction: t })
        
                        const resOrderItem = resItems.map(el => ({...el, OrderId: createOrder.id}))
                        const resOrderConcoction = resConcoctions.map(el => ({...el, OrderId: createOrder.id}))
                        await OrderItem.bulkCreate(resOrderItem, { transaction: t })
                        await OrderConcoction.bulkCreate(resOrderConcoction, { transaction: t })
                        await prescriptionData.update({ status: "ORDERED" }, {transaction:t})

                        await t.commit();
            
                        res.status(201).json({
                            message: "success",
                            data: createOrder.id
                        })
                    }else if(prescriptionData.status==="CANCELLED"){
                        throw new Error('data prescription cancelled');
                    }else{
                        throw new Error('data prescription already processed');
                    }
                }else{
                    throw new Error('data resep not found');
                }
            }else{
                throw new Error('user not found');
            }
        } catch(err) {
            await t.rollback();
            next(err)
        }
    }
}

module.exports = OrderController