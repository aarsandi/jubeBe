'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class UserEprescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserEprescription.hasMany(models.Patient)
      UserEprescription.hasMany(models.CartUser)
      UserEprescription.hasMany(models.Order)

      UserEprescription.belongsToMany(models.Promo, {
        through: 'PromoUser',
        as: 'Promos',
        foreignKey: 'UserEprescriptionId'
      })
    }
  }
  UserEprescription.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'username cannot be empty'
        },
        notNull: {
          msg: 'username cannot be null value'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'password cannot be empty'
        },
        notNull: {
          msg: 'password cannot be null value'
        },
        len: { 
          args: [7, 255],
          msg: "The password length should be at least 7 character"
        }
      }
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'fullname cannot be empty'
        },
        notNull: {
          msg: 'fullname cannot be null value'
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'phone number already exists'
      },
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'phone number cannot be empty'
        },
        notNull: {
          msg: 'phone number cannot be null value'
        }
      }
    },
    userVerification: DataTypes.BOOLEAN,
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    addressGeo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    avatar: DataTypes.STRING,
    referalCode: DataTypes.STRING,
    language: DataTypes.STRING,
    pushNotification: DataTypes.BOOLEAN,
    darkTheme: DataTypes.BOOLEAN,
    statusActive: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate(el) {
        el.password = hashPassword(el.password)
        el.phoneNumber = el.phoneNumber.startsWith("0") ? "62" + el.phoneNumber.slice(1) : el.phoneNumber
        el.darkTheme = false
        el.pushNotification = true
        el.language = 'id'
        el.statusActive = true
      }
    },
    sequelize,
    modelName: 'UserEprescription',
  });
  return UserEprescription;
};