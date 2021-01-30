'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('sms', 'read_status', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          after: "send_status",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('sms', 'read_status'),
    ]);
  }
};
