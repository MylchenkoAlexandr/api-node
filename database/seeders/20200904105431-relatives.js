'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Relatives', [
      {
        name: 'Son',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        name: 'Daughter',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wife',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        name: 'Husband',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Relatives', null, {});
  }
};
