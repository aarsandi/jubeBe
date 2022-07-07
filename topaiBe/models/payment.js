'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Order)
    }
  }
  Payment.init({
    OrderId: DataTypes.INTEGER,
    paymentRefNum: DataTypes.STRING,
    paymentDate: DataTypes.DATE,
    paymentMethod: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    gatewayName: DataTypes.STRING,
    createTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};