'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('leads', 'AD_in_proccess', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          after: "id",
        }),
        queryInterface.addColumn('leads', 'AD_called', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          after: "AD_in_proccess",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('leads', 'AD_in_proccess'),
      queryInterface.removeColumn('leads', 'AD_called')
    ]);
  }
};
