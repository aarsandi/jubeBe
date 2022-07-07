'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserDoctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: true,
        type: Sequelize.STRING
      },
      email: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: true,
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
      isApproved: {
        allowNull: false,
        type: Sequelize.STRING
      },
      document: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      sipNumber: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      practiceAddress: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      practiceAddressGeo: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      avatar: {
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
    await queryInterface.dropTable('UserDoctors');
  }
};