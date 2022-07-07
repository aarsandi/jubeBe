const {
    UserEprescription, ItemCategory, Item, CartUser, MasterItem_dropdown, ItemMedicineInfo,
    ItemStockWarehouse, ItemConversionUnit, sequelize, Sequelize
} = require("../../models/index");
const Op = Sequelize.Op;

class CartController {
    static async browse(req,res,next) {
        try {
            const datauser = req.decoded
            const result = await CartUser.findAll({
                where: {
                    UserEprescriptionId: datauser.id
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: { exclude: ['updatedAt'] },
                include: [
                    { model: Item, attributes: { exclude: ['updatedAt'] }, include: { model: MasterItem_dropdown, attributes: ['value'] } },
                    { model: ItemConversionUnit, attributes: { exclude: ['updatedAt', 'itemId', 'unitId'] } }
                ]
            })

            res.status(200).json({ message: "success", data: result })
        } catch(err) {
            next(err)
        }
    }

    static async add(req, res, next) {
        try {
            const { itemId, ItemConversionUnitId, qty=1, note='' } = req.body;
            const datauser = req.decoded

            const findCartData = await CartUser.findOne({
                where: {
                    UserEprescriptionId: datauser.id,
                    ItemId: itemId,
                    ItemConversionUnitId: ItemConversionUnitId?ItemConversionUnitId:null
                },
                attributes: { exclude: ['updatedAt'] },
                include: [
                    { model: Item, attributes: { exclude: ['updatedAt'] } }
                ]
            })

            const findItemData = await Item.findOne({
                where: {
                    id: itemId,
                    '$ItemMedicineInfo.medicineCatalog$': 'public'
                },
                attributes: { exclude: ['ItemCategoryId', 'updatedAt'] },
                include: [
                    { model: ItemCategory, attributes: { exclude: ['updatedAt'] } },
                    { model: MasterItem_dropdown },
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
                    },
                    { model: ItemMedicineInfo, attributes: ['medicineCatalog'] },
                    { model: ItemConversionUnit }
                ]
            })

            if(findItemData) {
                let dataTemp = findItemData.toJSON();
                if(dataTemp.ItemStockWarehouses.length) {
                    dataTemp.totalQty = dataTemp.ItemStockWarehouses.reduce( function(a, b) {
                        return a + b.qty;
                    }, 0);
                }else{
                    throw new Error('item stock is empty');
                }

                let qtyConversion = 1;
                if(ItemConversionUnitId) {
                    let conversionFind = dataTemp.ItemConversionUnits.find(el => el.id == ItemConversionUnitId)
                    if(conversionFind) {
                        qtyConversion = conversionFind.qtyKonversi
                    }else{
                        throw new Error('conversion data not found');
                    }
                }
                
                if(!findCartData) {
                    const resQty = Number(qty)*qtyConversion
                    if(dataTemp.totalQty>resQty) {
                        await CartUser.create({
                            UserEprescriptionId: datauser.id,
                            ItemId: itemId,
                            ItemConversionUnitId: ItemConversionUnitId,
                            qty: Number(qty),
                            note: note
                        })
    
                        res.status(201).json({ message: "success" })
                    }else{
                        throw new Error('item stock is not enough');
                    }
                }else{
                    const resQty = (findCartData.qty+Number(qty))*qtyConversion
                    if(dataTemp.totalQty>resQty) {
                        findCartData.set({
                            qty: findCartData.qty+Number(qty)
                        });
                        await findCartData.save();
                        res.status(200).json({ message: "success" })
                    }else{
                        throw new Error('item stock is not enough');
                    }
                }
            }else{
                res.status(404).json({ message: "data item not found" })
            }

        } catch(err) {
            next(err)
        }
    }
    
    static async editQty(req, res ,next) {
        try {
            const { qty } = req.body;
            const datauser = req.decoded
            const cartId = req.params.id;

            const findCartData = await CartUser.findOne({
                where: { id: cartId, UserEprescriptionId: datauser.id },
                attributes: { exclude: ['updatedAt'] },
                include: [
                    {
                        model: Item,
                        attributes: { exclude: ['updatedAt'] },
                        include: {
                            model: MasterItem_dropdown, attributes: ['value']
                        }
                    },
                    { model: ItemConversionUnit, attributes: { exclude: ['updatedAt', 'itemId', 'unitId'] } }
                ]
            })
            if(findCartData) {
                findCartData.set({
                    qty: qty
                });
                await findCartData.save();
                await findCartData.reload();
                res.status(200).json({ message: "success" })
            }else{
                res.status(404).json({ message: "data cart not found" })
            }
        } catch(err) {
            next(err)
        }
    }

    static async remove(req, res, next) {
        try {
            const datauser = req.decoded
            const cartId = req.params.id;

            const findCartData = await CartUser.findOne({
                where: { id: cartId, UserEprescriptionId: datauser.id }
            })
            if(findCartData) {
                findCartData.destroy();
                res.status(200).json({ message: "success", cartId: findCartData.id })
            }else{
                res.status(404).json({ message: "data cart not found" })
            }
        } catch(err) {
            next(err)
        }
    }
}

module.exports = CartController