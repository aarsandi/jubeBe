'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemConversionUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemConversionUnit.belongsTo(models.Item, {
        foreignKey: {
            name: 'itemId'
          }
        });
    }
  }
  ItemConversionUnit.init({
    itemId: DataTypes.INTEGER,
    unitId: DataTypes.INTEGER,
    qtyKonversi: DataTypes.FLOAT,
    price: DataTypes.FLOAT,
    nameUnit: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ItemConversionUnit',
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });
  return ItemConversionUnit;
};