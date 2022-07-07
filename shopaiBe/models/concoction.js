'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Concoction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Concoction.hasMany(models.ConcoctionItem)
      Concoction.belongsTo(models.Prescription)
      Concoction.belongsToMany(models.Item, {
        through: 'ConcoctionItem',
        as: 'Items',
        foreignKey: 'ConcoctionId'
      })
    }
  }
  Concoction.init({
    PrescriptionId: DataTypes.INTEGER,
    name: DataTypes.STRING,    
    price: DataTypes.FLOAT,
    frequency: DataTypes.STRING,
    doseQty: DataTypes.FLOAT,
    qtyInText: DataTypes.STRING,
    qty: DataTypes.FLOAT,
    optional: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Concoction',
  });
  return Concoction;
};