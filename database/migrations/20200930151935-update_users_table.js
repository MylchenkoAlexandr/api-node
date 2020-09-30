'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'not_assign', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          after: "banned",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'not_assign'),
    ]);
  }
};
