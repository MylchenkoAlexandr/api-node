'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Types', [{
      name: 'auto',
      title: 'Auto',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'life',
      title: 'Life',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'moto',
      title: 'Moto',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'health',
      title: 'Health',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'renters',
      title: 'Renters',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'medicare',
      title: 'Medicare',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'pet',
      title: 'Pet',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Types', null, {});
  }
};
