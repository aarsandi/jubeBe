'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Prescriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserDoctorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "UserDoctors",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      PatientId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Patients",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      administration: {
        allowNull: false,
        type: Sequelize.JSON
      },
      pharmaceutical: {
        allowNull: false,
        type: Sequelize.JSON
      },
      clinical: {
        allowNull: false,
        type: Sequelize.JSON
      },
      verification: {
        allowNull: false,
        type: Sequelize.JSON
      },
      drugRelatedProblem: {
        allowNull: false,
        type: Sequelize.JSON
      },
      instructionFeedback: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      notes: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      totalPrice: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      orderDate: {
        type: Sequelize.DATE
      },
      orderDueDate: {
        type: Sequelize.DATE
      },
      adminRoute: {
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
    await queryInterface.dropTable('Prescriptions');
  }
};