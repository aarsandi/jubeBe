'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    let timeNow = new Date()
    let data = [
      {
        title: "Promo Diskon 10 Persen",
        isCoupon: true,
        isPercent: true,
        type: "discount_product",
        amount: 0.10,
        promoDesc: "DISKON10PERC",
        img: "img",
        expiredDate: new Date(timeNow.getTime() + (25 * 86400000)),
        minTransaction: 100000,
        isActive: true
      },
      {
        title: "Promo Diskon Rp.150.000",
        isCoupon: false,
        isPercent: false,
        type: "discount_product",
        amount: 150000,
        promoDesc: "DISKONNEW15",
        img: "img",
        expiredDate: null,
        minTransaction: null,
        isActive: true
      },
    ]
    data = data.map(temp => {
      temp.createdAt = new Date()
      temp.updatedAt = new Date()
      return temp
    })
    await queryInterface.bulkInsert('Promos', data, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Promos', null, {})
  }
};
