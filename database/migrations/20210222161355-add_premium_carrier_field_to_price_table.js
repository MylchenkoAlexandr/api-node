'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // premium_carrier
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('prices', 'premium_carrier', {
          type: Sequelize.DataTypes.STRING,
          defaultValue: null,
          after: "price",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('prices', 'premium_carrier'),
    ]);
  }
};
