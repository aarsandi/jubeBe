const { Item, ItemCategory, ItemMedicineInfo, ItemConversionUnit, ItemStockWarehouse, MasterItem_dropdown, Sequelize, sequelize } = require("../../models/index");
const Op = Sequelize.Op;

class ItemController {
    static async browse(req, res, next) {
        try {
            const { page = 1, limit = 10, search , searchBy = "itemName", isPublic = "true" } = req.query
            let query = {}

            if(search&&searchBy) {
                const whitelist = [ "itemName", "itemCode" ];
                if(whitelist.includes(searchBy)){
                    query[searchBy] = { [Op.iLike]: `%${search}%` }
                }else{
                    res.status(400).json({ message: "search by value mismatch, expected itemName and itemCode" });
                }
            }

            if(isPublic == "true") {
                query['$ItemMedicineInfo.medicineCatalog$'] = 'public'
            }

            const result = await Item.findAll({
                where: query,
                offset: (page - 1) * limit, limit: limit,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    { model: MasterItem_dropdown },
                    { model: ItemCategory, attributes: ['id','title'] },
                    { model: ItemMedicineInfo, attributes: ['medicineCatalog'] },
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
                attributes: { exclude: ['ItemCategoryId', 'updatedAt'] },
                subQuery: false
            })
            if(result.length) {
                const resultJson = result.map(el => {
                    let temp = el.toJSON();
                    if(temp.ItemStockWarehouses.length) {
                        temp.totalQty = temp.ItemStockWarehouses.reduce( function(a, b){
                            return a + b.qty;
                        }, 0);
                    }else{
                        temp.totalQty = 0
                    }
                    temp.unit = temp.MasterItem_dropdown.value
                    temp.medicineCatalog = temp.ItemMedicineInfo?temp.ItemMedicineInfo.medicineCatalog:""
                    delete temp.MasterItem_dropdown
                    delete temp.ItemMedicineInfo
                    delete temp.ItemStockWarehouse
                    return temp
                })
                
                let countData = await Item.findAndCountAll({
                    where: query,
                    include: [
                        { model: MasterItem_dropdown },
                        { model: ItemCategory, attributes: ['id','title'] },
                        { model: ItemMedicineInfo, attributes: ['medicineCatalog'] },
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
                    data: resultJson,
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

    static async browseByCat(req, res, next) {
        try {
            const { page = 1, limit = 10, categoryId, isPublic } = req.query
            let query = {}
            if(categoryId) {
                query.ItemCategoryId = categoryId
            }

            if(isPublic == "true") {
                query['$ItemMedicineInfo.medicineCatalog$'] = { [Op.eq]: 'public' }
            } else if(isPublic == "false") {
                query['$ItemMedicineInfo.medicineCatalog$'] = 'eprescription'
            }
            
            const result = await Item.findAll({
                where: query,
                offset: (page - 1) * limit, limit: limit,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    { model: MasterItem_dropdown },
                    { model: ItemCategory, attributes: ['id','title'] },
                    { model: ItemMedicineInfo, attributes: ['medicineCatalog'] },
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
                attributes: { exclude: ['ItemCategoryId', 'updatedAt'] },
                subQuery: false,
            })
            
            if(result.length) {
                const resultJson = result.map(el => {
                    let temp = el.toJSON();
                    if(temp.ItemStockWarehouses.length) {
                        temp.totalQty = temp.ItemStockWarehouses.reduce( function(a, b){
                            return a + b.qty;
                        }, 0);
                    }else{
                        temp.totalQty = 0
                    }
                    temp.unit = temp.MasterItem_dropdown.value
                    temp.medicineCatalog = temp.ItemMedicineInfo?temp.ItemMedicineInfo.medicineCatalog:""
                    delete temp.MasterItem_dropdown
                    delete temp.ItemMedicineInfo
                    delete temp.ItemStockWarehouse
                    return temp
                })

                const countData = await Item.findAndCountAll({
                    where: query,
                    include: [
                        { model: MasterItem_dropdown },
                        { model: ItemCategory, attributes: ['id','title'] },
                        { model: ItemMedicineInfo, attributes: ['medicineCatalog'] },
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
                })
                
                let hasPrevPage;
                let hasNextPage;
                let totalPages = Math.ceil(countData.count / limit)                

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
                
                res.status(200).json({                    
                    message: "success",
                    data: resultJson,
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

    static async browseCategory(req, res, next) {
        try {
            const result = await ItemCategory.findAll({
                attributes: { exclude: ['updatedAt'] }
            })

            res.status(200).json({ message: "success", data: result })
        } catch(err) {
            next(err)
        }
    }

    static async read(req, res, next) {
        try {
            const itemId = req.params.id;
            const result = await Item.findByPk(itemId, {
                attributes: { exclude: ['ItemCategoryId', 'updatedAt'] },
                include: [
                    { model: MasterItem_dropdown },
                    { model: ItemCategory, attributes: { exclude: ['updatedAt'] } },
                    { model: ItemMedicineInfo, attributes: {exclude: ['updatedAt']} },
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
                ]
            })
            if(result) {
                let resultJson = result.toJSON();
                if(resultJson.ItemStockWarehouses.length) {
                    resultJson.totalQty = resultJson.ItemStockWarehouses.reduce( function(a, b){
                        return a + b.qty;
                    }, 0);
                }else{
                    resultJson.totalQty = 0
                }
                resultJson.unit = resultJson.MasterItem_dropdown.value
                resultJson.medicineCatalog = resultJson.ItemMedicineInfo?resultJson.ItemMedicineInfo.medicineCatalog:""
                delete resultJson.MasterItem_dropdown
                delete resultJson.ItemStockWarehouses

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
        } catch(err) {
            next(err)
        }
        
    }

    static async updateStok(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { items } = req.body
            for await (let ele of items) {
                let findItem = await Item.findOne({
                    where: { id: ele.ItemId },
                    attributes: { exclude: ['updatedAt'] },
                    include: [
                        { model: ItemStockWarehouse, attributes: ['id','ItemId', 'qty', 'expiredDate'],
                            required: false,
                            where: {
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
                        }
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
                        throw new Error('data item stock is empty');
                    }
                    // console.log(findItem)
                    // console.log(findItem.ItemStockWarehouses[0].qty)
                    if(ele.action == 'stock_decrement') {
                        if(dataTemp.totalQty >= ele.qty) {
                            let qtyRealRemaining = ele.qty || 0;
                            for await (let elStock of findItem.ItemStockWarehouses) {
                                let qtyRemain = qtyRealRemaining - elStock.qty                                
                                if(qtyRemain>0) {
                                    await elStock.update({qty: 0}, { transaction:t });
                                    qtyRealRemaining -= item.qty
                                } else {
                                    await elStock.update({qty: elStock.qty-qtyRealRemaining}, { transaction:t });
                                    break
                                }
                            }
                        }else{
                            throw new Error('item stock is not enough');
                        }
                    }else{
                        await findItem.ItemStockWarehouses[0].update({
                            qty: findItem.ItemStockWarehouses[0].qty+ele.qty
                        }, { transaction:t });
                    }
                }else{
                    throw new Error('data not found');
                }
            }
            await t.commit();
            res.status(200).json({
                message: "success"
            })
        } catch(err) {
            await t.rollback();
            next(err)
        }
    }
}

module.exports = ItemController