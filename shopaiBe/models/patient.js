'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patient.hasMany(models.Prescription)
      
      Patient.belongsTo(models.UserDoctor)
      Patient.belongsTo(models.UserEprescription)
    }
  }
  Patient.init({    
    UserEprescriptionId: DataTypes.INTEGER,
    UserDoctorId: DataTypes.INTEGER,
    nik: DataTypes.STRING,
    regNumber: DataTypes.STRING,
    fullname: DataTypes.STRING,
    dob: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Field must be a date type'
        }
      }
    },
    gender: DataTypes.STRING,
    berat: DataTypes.FLOAT,
    tinggi: DataTypes.FLOAT,
    tensi: DataTypes.FLOAT,
    saturasi: DataTypes.FLOAT,
    suhu: DataTypes.FLOAT,
    allergic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};