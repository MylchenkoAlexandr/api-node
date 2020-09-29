'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('records', 'call_sid'),
        queryInterface.removeColumn('records', 'sid'),
        queryInterface.removeColumn('records', 'datetime'),

        queryInterface.addColumn('records', 'url', {
          type: Sequelize.DataTypes.TEXT,
          after: "lead_id",
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('records', 'url'),
        queryInterface.addColumn('records', 'call_sid', {
          type: Sequelize.DataTypes.STRING,
          after: "lead_id",
        }, { transaction: t }),
        queryInterface.addColumn('records', 'sid', {
          type: Sequelize.DataTypes.STRING,
          after: "lead_id",
        }, { transaction: t }),
        queryInterface.addColumn('records', 'datetime', {
          type: Sequelize.DataTypes.DATE,
          after: "lead_id",
        }, { transaction: t }),]);
    });
  },
};
