'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemStockInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemStockInfo.belongsTo(models.Item)
    }
  }
  ItemStockInfo.init({
    ItemId: DataTypes.INTEGER,
    itemCode: DataTypes.STRING,
    warehouse: DataTypes.STRING,
    rackAlphabet: DataTypes.STRING,
    rackNumber: DataTypes.STRING,
    statusItemStock: DataTypes.BOOLEAN,
    statusItemProd: DataTypes.BOOLEAN,
    distributor: DataTypes.STRING,
    expiredDate: DataTypes.DATE,
    minQty: DataTypes.INTEGER,
    maxQty: DataTypes.INTEGER,
    qty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ItemStockInfo',
  });
  return ItemStockInfo;
};