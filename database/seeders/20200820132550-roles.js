'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        title: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'agent',
        title: 'Agent',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'guide',
        title: 'Guide',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
