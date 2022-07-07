'use strict';

const fs = require('fs')

module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {
        title: 'Obat Keras',
        detail: '',
        image: ''
      },
      {
        title: 'Obat Bebas',
        detail: '',
        image: ''
      },
      {
        title: 'Obat Herbal',
        detail: '',
        image: ''
      },
    ]
    data = data.map(temp => {
      temp.createdAt = new Date()
      temp.updatedAt = new Date()
      return temp
    })
    await queryInterface.bulkInsert('ItemCategories', data, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
      await queryInterface.bulkDelete('ItemCategories', null, {})
  }
};
