'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderHistory.init({
    OrderId: DataTypes.INTEGER,
    histStatus: DataTypes.STRING,
    message: DataTypes.STRING,
    comment: DataTypes.STRING,
    createdBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderHistory',
  });
  return OrderHistory;
};