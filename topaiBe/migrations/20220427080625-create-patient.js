'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Patients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserDoctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "UserDoctors",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
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
      nik: {
        allowNull: false,
        type: Sequelize.STRING
      },
      regNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fullname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dob: {
        allowNull: false,
        type: Sequelize.DATE
      },
      gender: {
        allowNull: false,
        type: Sequelize.STRING
      },
      berat: {
        type: Sequelize.FLOAT
      },
      tinggi: {
        type: Sequelize.FLOAT
      },
      tensi: {
        type: Sequelize.FLOAT
      },
      saturasi: {
        type: Sequelize.FLOAT
      },
      suhu: {
        type: Sequelize.FLOAT
      },      
      allergic: {
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
    await queryInterface.dropTable('Patients');
  }
};