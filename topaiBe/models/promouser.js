'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PromoUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PromoUser.belongsTo(models.Promo)
    }
  }
  PromoUser.init({
    PromoId: DataTypes.INTEGER,
    UserEprescriptionId: DataTypes.INTEGER,
    amountUsed: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PromoUser',
  });
  return PromoUser;
};