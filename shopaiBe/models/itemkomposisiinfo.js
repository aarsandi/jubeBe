'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemKomposisiInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemKomposisiInfo.belongsTo(models.Item)
    }
  }
  ItemKomposisiInfo.init({
    ItemId: DataTypes.INTEGER,
    itemCode: DataTypes.STRING,
    composes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ItemKomposisiInfo',
  });
  return ItemKomposisiInfo;
};