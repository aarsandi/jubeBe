const {
    Order, Sequelize, sequelize, OrderHistory, Prescription, ItemStockWarehouse, ItemStockInfo
} = require("../models/index");
const Op = Sequelize.Op;
const moment = require('moment');

class Cronjob {
    static async OrderExpiredWatch() {
        const result = await Order.findAll({
            where: {
                paymentDueDate: { [Op.lte]: new Date() },
                status:'UNPAID'
            },
            raw : true,
        })
        
        if(result.length) {
            const genDateNow = moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
            let updateItemTemp = []
            for await (let item of result) {
                for await (let itemStock of item.stockReduce) {
                    const findIndex = updateItemTemp.findIndex(el => {
                        return el.ItemStockWarehouseId === itemStock.ItemStockWarehouseId&&el.ItemStockInfoId === itemStock.ItemStockInfoId
                    });
                    if(findIndex >= 0) {
                        updateItemTemp[findIndex].updateQty = updateItemTemp[findIndex].updateQty + itemStock.reducedQty;
                    }else{
                        updateItemTemp.push({
                            ItemId: itemStock.ItemId,
                            ItemStockWarehouseId: itemStock.ItemStockWarehouseId,
                            ItemStockInfoId: itemStock.ItemStockInfoId,
                            updateQty: itemStock.reducedQty
                        })
                    }
                }
                await Order.update({status: 'CANCELLED',comment:`${genDateNow} * Pembeli telah melebihi batas waktu pembayaran`}, {where: {id: item.id}})
                await OrderHistory.create({
                    OrderId: item.id,
                    histStatus: 'CANCELLED',
                    message: '',
                    comment: "Pembeli telah melebihi batas waktu pembayaran",
                    createdBy: 'system'
                })
                if(result.PrescriptionId) {
                    await Prescription.update({status: 'CANCELLED',comment:`${genDateNow} * Pasien telah melebihi batas waktu order`}, {where: {id: result.PrescriptionId}})
                }
            }
            
            for await (let ele of updateItemTemp) {
                const stokInfofind = await ItemStockInfo.findByPk(ele.ItemStockInfoId)
                const stockWarehosfind = await ItemStockWarehouse.findByPk(ele.ItemStockWarehouseId)
                await stokInfofind.increment({
                    'qty': ele.updateQty
                });
                await stockWarehosfind.increment({
                    'qty': ele.updateQty
                });
            }
        }
    }

    static async PrescriptionExpiredWatch() {
        const result = await Prescription.findAll({
            where: {
                orderDueDate: { [Op.lte]: new Date() },
                status: 'CREATED'
            },
            raw : true,
        })
        
        if(result.length) {
            const genDateNow = moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
            for await (let item of result) {
                await Prescription.update({status: 'CANCELLED',comment:`${genDateNow} * Pasien telah melebihi batas waktu order`}, {where: {id: item.id}})
            }
        }
    }
}
module.exports = Cronjob;