'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemMedicineInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemMedicineInfo.belongsTo(models.Item)
    }
  }
  ItemMedicineInfo.init({
    ItemId: DataTypes.INTEGER,
    itemCode: DataTypes.STRING,
    genericName: DataTypes.STRING,
    medicineCatalog: DataTypes.STRING,
    mimsClassification: DataTypes.STRING,
    content: DataTypes.INTEGER,
    medicineClassification: DataTypes.INTEGER,
    pregnantPatientCategory: DataTypes.INTEGER,
    atfClassification: DataTypes.STRING,
    formPackage: DataTypes.INTEGER,
    statusVen: DataTypes.INTEGER,
    medicineFunction: DataTypes.STRING,
    additionalInstructions: DataTypes.STRING,
    storageMethod: DataTypes.STRING,
    formularium: DataTypes.BOOLEAN,
    highAlertMed: DataTypes.BOOLEAN,
    obatInjeksi: DataTypes.BOOLEAN,
    formulariumBPJS: DataTypes.BOOLEAN,
    lookALike: DataTypes.BOOLEAN,
    formulariumNasional: DataTypes.BOOLEAN,
    formulariumKaryawan: DataTypes.BOOLEAN,
    obatLuar: DataTypes.BOOLEAN,
    kontrolExpired: DataTypes.BOOLEAN,
    obatGenerik: DataTypes.BOOLEAN,
    obatKronis: DataTypes.BOOLEAN,
    precursor: DataTypes.BOOLEAN,
    obatTertentu: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ItemMedicineInfo',
  });
  return ItemMedicineInfo;
};