'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Concoctions', {
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
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      frequency: {
        allowNull: false,
        type: Sequelize.STRING
      },
      doseQty: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      qtyInText: {
        allowNull: false,
        type: Sequelize.STRING
      },
      qty: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      optional: {
        type: Sequelize.STRING
      },
      status: {
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
    await queryInterface.dropTable('Concoctions');
  }
};