'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('subroles', [
      {
        name: "l_i",
        title: "Life Insurance",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "h_i",
        title: "Health Insurance",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "m_i",
        title: "Medicare Insurance",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('status', null, {});
  }
};
