'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('status', [
      {
        name: "newLead",
        title: "New Lead",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "contactAttempt2",
        title: "Contact attempt 2",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "contactAttempt3",
        title: "Contact attempt 3",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "contactAttempt4",
        title: "Contact attempt 4",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "doNotCall",
        title: "Do not call",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "emailed",
        title: "Emailed",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "underwriting",
        title: "Underwriting",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "purchased",
        title: "Purchased",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "in-force",
        title: "In-force",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('status', null, {});
  }
};
