'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('settings', 'autodialler', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          after: "assignment",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('settings', 'autodialler'),
    ]);
  }
};
