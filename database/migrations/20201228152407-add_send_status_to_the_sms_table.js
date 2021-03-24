'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('sms', 'send_status', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: null,
          after: "user_id",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('sms', 'send_status'),
    ]);
  }
};
