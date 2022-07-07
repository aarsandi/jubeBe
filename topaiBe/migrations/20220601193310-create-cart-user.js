'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CartUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserEprescriptionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'UserEprescriptions',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      ItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Items",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      ItemConversionUnitId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "ItemConversionUnit",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      qty: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      note: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('CartUsers');
  }
};