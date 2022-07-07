'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDoctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDoctor.hasMany(models.Prescription)
      UserDoctor.hasMany(models.Patient)
    }
  }
  UserDoctor.init({
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'email already exists'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'email cannot be empty'
        },
        notNull: {
          msg: 'email cannot be null value'
        },
        isEmail: {
          args: true,
          msg: 'Invalid email format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
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
      allowNull: false,
      unique: {
        args: true,
        msg: 'phone number already exists'
      },
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
    isApproved: DataTypes.STRING,
    document: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'document cannot be empty'
        },
        notNull: {
          msg: 'document cannot be null value'
        }
      }
    },
    sipNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'SIP number already exists'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'SIP number cannot be empty'
        },
        notNull: {
          msg: 'SIP number cannot be null value'
        }
      }
    },
    practiceAddress: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    practiceAddressGeo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    avatar: DataTypes.STRING,
    language: DataTypes.STRING,
    pushNotification: DataTypes.BOOLEAN,
    darkTheme: DataTypes.BOOLEAN,
    statusActive: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate(el) {
        el.userVerification = false
        el.isApproved = ''
        el.phoneNumber = el.phoneNumber.startsWith("0") ? "62" + el.phoneNumber.slice(1) : el.phoneNumber
        el.darkTheme = false
        el.pushNotification = true
        el.language = 'id'
        el.statusActive = true
      }
    },
    sequelize,
    modelName: 'UserDoctor',
  });
  return UserDoctor;
};