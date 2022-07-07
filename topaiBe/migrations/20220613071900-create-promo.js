'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Promos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isCoupon: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      isPercent: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      isActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      promoDesc: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      img: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      expiredDate: {
        type: Sequelize.DATE
      },
      minTransaction: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Promos');
  }
};