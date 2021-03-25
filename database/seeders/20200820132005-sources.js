'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('sources',
      [
        {
          name: 'blueberry',
          title: 'Blueberry',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          name: 'mediaalpha',
          title: 'Media Alpha',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'manual',
          title: 'Manual',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'bulk',
          title: 'Bulk',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'clickListing',
          title: 'Click Listing',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'liveTransfer',
          title: 'Live Transfer',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('sources', null, {});
  }
};
