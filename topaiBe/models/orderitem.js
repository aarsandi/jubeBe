'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderItem.init({
    OrderId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    subtotalPrice: DataTypes.FLOAT,
    subTotalAmount: DataTypes.FLOAT,
    tax_amount: DataTypes.FLOAT,
    qtyUnit: DataTypes.FLOAT,
    unit: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};