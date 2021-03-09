'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('status', [
      {
        name: "agreement",
        title: "Agreement",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "approved",
        title: "Approved",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "aota",
        title: "AOTA",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "condIssued",
        title: "Cond Issued",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('status', null, {});
  }
};
