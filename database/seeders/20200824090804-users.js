'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        role_id: 1,
        fname: 'Admin',
        lname: 'Admin',
        email: 'admin@t.com',
        password: await bcrypt.hash('password', 10),
        states: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        role_id: 2,
        fname: 'Agent',
        lname: 'Agent',
        email: 'agent@t.com',
        password: await bcrypt.hash('password', 10),
        states: JSON.stringify(["CA", "NY"]),
        createdAt: new Date(),
        updatedAt: new Date()
      },]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
