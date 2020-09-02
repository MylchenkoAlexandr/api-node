'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Records', 'call_sid'),
        queryInterface.removeColumn('Records', 'sid'),
        queryInterface.removeColumn('Records', 'datetime'),

        queryInterface.addColumn('Records', 'url', {
          type: Sequelize.DataTypes.TEXT,
          after: "lead_id",
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Records', 'url'),
        queryInterface.addColumn('Records', 'call_sid', {
          type: Sequelize.DataTypes.STRING,
          after: "lead_id",
        }, { transaction: t }),
        queryInterface.addColumn('Records', 'sid', {
          type: Sequelize.DataTypes.STRING,
          after: "lead_id",
        }, { transaction: t }),
        queryInterface.addColumn('Records', 'datetime', {
          type: Sequelize.DataTypes.DATE,
          after: "lead_id",
        }, { transaction: t }),]);
    });
  },
};
