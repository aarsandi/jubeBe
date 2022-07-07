'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasterItem_dropdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterItem_dropdown.init({
    name: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MasterItem_dropdown',
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });
  return MasterItem_dropdown;
};