'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'in_call', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          after: "active",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'in_call'),
    ]);
  }
};
