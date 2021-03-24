'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('customers_voice_mails', 'listen_status', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          after: "url",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('customers_voice_mails', 'listen_status'),
    ]);
  }
};
