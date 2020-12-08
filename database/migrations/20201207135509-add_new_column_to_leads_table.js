'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('leads', 'AD_procced', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          after: "AD_status",
        }),
        queryInterface.addColumn('leads', 'CRON_hours', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          after: "AD_procced",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('leads', 'AD_procced'),
      queryInterface.removeColumn('leads', 'CRON_hours')
    ]);
  }
};
