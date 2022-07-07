'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserEprescriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fullname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phoneNumber: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      userVerification: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      address: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      addressGeo: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      avatar: {
        allowNull: false,
        type: Sequelize.STRING
      },
      referalCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      // en - id
      language: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pushNotification: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      darkTheme: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      statusActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserEprescriptions');
  }
};