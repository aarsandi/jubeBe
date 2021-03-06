'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
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
      PrescriptionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Prescriptions",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      orderRefNumber: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      pickupMethod: {
        allowNull: false,
        type: Sequelize.STRING
      },
      orderType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ttlItemPrice: {
        type: Sequelize.FLOAT
      },
      ttlAmount: {
        type: Sequelize.FLOAT
      },
      ttlItem: {
        type: Sequelize.INTEGER
      },
      paymentDate: {
        type: Sequelize.DATE
      },
      paymentDueDate: {
        type: Sequelize.DATE
      },
      shippingDate: {
        type: Sequelize.DATE
      },
      deliveredDate: {
        type: Sequelize.DATE
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address: {
        allowNull: false,
        type: Sequelize.JSON
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      stockReduce: {
        allowNull: false,
        type: Sequelize.JSON
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
    await queryInterface.dropTable('Orders');
  }
};