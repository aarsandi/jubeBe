'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
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
      ItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'Items',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      subtotalPrice: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      subTotalAmount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      tax_amount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      qtyUnit: {
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
    await queryInterface.dropTable('OrderItems');
  }
};