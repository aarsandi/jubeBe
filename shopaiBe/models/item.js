'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.ItemCategory)
      Item.belongsToMany(models.Concoction, {
        through: 'ConcoctionItem',
        as: 'Concoctions',
        foreignKey: 'ItemId'
      })
      Item.hasOne(models.ItemMedicineInfo)
      Item.hasOne(models.ItemKomposisiInfo)
      Item.belongsTo(models.MasterItem_dropdown, {
        foreignKey: {
          name: 'unitId'
        }
      })
      Item.hasMany(models.ItemStockInfo)
      Item.hasMany(models.ItemStockWarehouse)
      Item.hasMany(models.ItemConversionUnit, {
        foreignKey: {
            name: 'itemId'
          }
      })
    }
  }
  Item.init({
    ItemCategoryId: DataTypes.INTEGER,
    itemCode: DataTypes.STRING,
    itemName: DataTypes.STRING,
    itemDesc: DataTypes.TEXT,
    fileImg: DataTypes.STRING,
    penjualanDibulatkan: DataTypes.BOOLEAN,
    penjualanSesuaiTrans: DataTypes.BOOLEAN,
    pemakaianDibulatkan: DataTypes.BOOLEAN,
    pemakaianSesuaiTrans: DataTypes.BOOLEAN,
    tipeTransaksi: DataTypes.INTEGER,
    statusItem: DataTypes.INTEGER,
    productLine: DataTypes.STRING,
    markup: DataTypes.INTEGER,
    het: DataTypes.DOUBLE,
    hja: DataTypes.FLOAT,
    unitId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};