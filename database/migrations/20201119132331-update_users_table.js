'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'AD_status', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          after: "id",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'AD_status'),
    ]);
  }
};
