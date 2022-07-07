'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.UserEprescription)
      Order.belongsTo(models.Prescription)

      Order.hasMany(models.OrderConcoction)
      Order.hasMany(models.OrderItem)
      Order.hasOne(models.Payment)
    }
  }
  Order.init({
    UserEprescriptionId: DataTypes.INTEGER,
    PrescriptionId: DataTypes.INTEGER,
    orderRefNumber: DataTypes.STRING,
    pickupMethod: DataTypes.STRING,
    orderType: DataTypes.STRING,
    ttlItemPrice: DataTypes.FLOAT,
    ttlAmount: DataTypes.FLOAT,
    ttlItem: DataTypes.INTEGER,
    paymentDate: DataTypes.DATE,
    paymentDueDate: DataTypes.DATE,
    shippingDate: DataTypes.DATE,
    deliveredDate: DataTypes.DATE,
    comment: DataTypes.STRING,
    address: DataTypes.JSON,
    status: DataTypes.STRING,
    stockReduce: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};