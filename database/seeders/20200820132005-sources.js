'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Sources', [{
      name: 'blueberry',
      title: 'Blueberry',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'mediaalpha',
      title: 'Media Alpha',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Sources', null, {});
  }
};
