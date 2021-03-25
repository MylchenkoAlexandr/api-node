'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.renameColumn('leads', 'AD_called', 'AD_status'),
        queryInterface.removeColumn('leads', 'AD_in_proccess'),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('leads', 'AD_status', 'AD_called'),
      queryInterface.addColumn('leads', 'AD_in_proccess', {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: 0,
        after: "id",
      }),
    ]);
  }
};
