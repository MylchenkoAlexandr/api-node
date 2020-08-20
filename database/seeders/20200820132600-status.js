'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Status', [
      {
        name: 'new',
        title: 'New',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'firstCall',
        title: 'First Call',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'responded',
        title: 'Responded',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'responded10mins',
        title: 'Responded 10 Mins',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'startedApp',
        title: 'Started App',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'purchased',
        title: 'Purchased',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Status', null, {});
  }
};
