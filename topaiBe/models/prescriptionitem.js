'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PrescriptionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PrescriptionItem.belongsTo(models.Prescription)
      PrescriptionItem.belongsTo(models.Item)
      PrescriptionItem.belongsTo(models.ItemConversionUnit)
    }
  }
  PrescriptionItem.init({
    PrescriptionId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    ItemConversionUnitId: DataTypes.INTEGER,
    frequency: DataTypes.STRING,
    doseQty: DataTypes.FLOAT,
    orderQty: DataTypes.FLOAT,
    price: DataTypes.FLOAT,
    subTotal: DataTypes.FLOAT,
    unit: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PrescriptionItem',
  });
  return PrescriptionItem;
};