'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PrescriptionHistories', {
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
      histStatus: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
      },
      createdBy: {
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
    await queryInterface.dropTable('PrescriptionHistories');
  }
};