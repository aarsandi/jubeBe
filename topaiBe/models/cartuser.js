'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartUser.belongsTo(models.UserEprescription)
      CartUser.belongsTo(models.Item)
      CartUser.belongsTo(models.ItemConversionUnit)
    }
  }
  CartUser.init({
    UserEprescriptionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ItemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ItemConversionUnitId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    note: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(el) {
        el.qty = 1
        el.note = ''
      }
    },
    sequelize,
    modelName: 'CartUser',
  });
  return CartUser;
};