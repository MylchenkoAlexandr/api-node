'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'INBOUND_status', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          after: "AD_status",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'INBOUND_status'),
    ]);
  }
};
