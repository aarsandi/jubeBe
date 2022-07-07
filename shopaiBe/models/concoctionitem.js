'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConcoctionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ConcoctionItem.belongsTo(models.Concoction)
      ConcoctionItem.belongsTo(models.Item)
    }
  }
  ConcoctionItem.init({
    ConcoctionId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    dose: DataTypes.FLOAT,
    unit: DataTypes.STRING,
    price: DataTypes.FLOAT,
    subTotal: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'ConcoctionItem',
  });
  return ConcoctionItem;
};