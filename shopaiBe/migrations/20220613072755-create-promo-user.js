'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PromoUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PromoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Promos",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      UserEprescriptionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "UserEprescriptions",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      amountUsed: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('PromoUsers');
  }
};