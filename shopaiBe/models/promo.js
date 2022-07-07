'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promo.hasMany(models.PromoUser)
      Promo.belongsToMany(models.UserEprescription, {
        through: 'PromoUser',
        as: 'UserEprescriptions',
        foreignKey: 'PromoId'
      })
    }
  }
  Promo.init({
    title: DataTypes.STRING,
    isCoupon: DataTypes.BOOLEAN,
    isPercent: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
    type: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    promoDesc: DataTypes.STRING,
    img: DataTypes.TEXT,
    expiredDate: DataTypes.DATE,
    minTransaction: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Promo',
  });
  return Promo;
};