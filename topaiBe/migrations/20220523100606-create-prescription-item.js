'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PrescriptionItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PrescriptionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Prescriptions",
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
      ItemConversionUnitId: {
        type: Sequelize.INTEGER,
        references: {
          model: "ItemConversionUnit",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      frequency: {
        allowNull: false,
        type: Sequelize.STRING
      },
      doseQty: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      orderQty: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      subTotal: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      unit: {
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
    await queryInterface.dropTable('PrescriptionItems');
  }
};