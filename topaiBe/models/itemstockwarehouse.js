'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemStockWarehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemStockWarehouse.belongsTo(models.Item)
    }
  }
  ItemStockWarehouse.init({
    ItemId: DataTypes.INTEGER,
    warehouseId: DataTypes.INTEGER,
    rackId: DataTypes.INTEGER,
    itemCode: DataTypes.STRING,
    expiredDate: DataTypes.DATE,
    qty: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'ItemStockWarehouse',
    freezeTableName: true,
  });
  return ItemStockWarehouse;
};