'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Prescription.belongsToMany(models.Item, {
        through: 'PrescriptionItem',
        as: 'Items',
        foreignKey: 'PrescriptionId'
      })
      Prescription.hasMany(models.PrescriptionItem)
      Prescription.hasMany(models.Concoction)

      Prescription.belongsTo(models.UserDoctor)
      Prescription.belongsTo(models.Patient)
    }
  }
  Prescription.init({
    UserDoctorId: DataTypes.INTEGER,
    PatientId: DataTypes.INTEGER,
    administration: DataTypes.JSON,
    pharmaceutical: DataTypes.JSON,
    clinical: DataTypes.JSON,
    verification: DataTypes.JSON,
    drugRelatedProblem: DataTypes.JSON,
    instructionFeedback: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    totalPrice: DataTypes.FLOAT,
    comment: DataTypes.STRING,
    status: DataTypes.STRING,
    orderDate: DataTypes.DATE,
    orderDueDate: DataTypes.DATE,
    adminRoute: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Prescription',
  });
  return Prescription;
};