'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ConcoctionItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ConcoctionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Concoctions",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      ItemId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Items",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      dose: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      unit: {
        allowNull: false,
        type: Sequelize.STRING
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      subTotal: {
        allowNull: false,
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('ConcoctionItems');
  }
};