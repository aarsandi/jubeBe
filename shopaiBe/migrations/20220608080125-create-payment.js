'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'Orders',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      paymentRefNum: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      paymentDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      paymentMethod: {
        allowNull: false,
        type: Sequelize.STRING
      },
      paymentStatus: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createTime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      gatewayName: {
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
    await queryInterface.dropTable('Payments');
  }
};