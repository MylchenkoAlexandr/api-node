'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'twilio_phone', {
          type: Sequelize.DataTypes.STRING,
          defaultValue: null,
          after: "phone",
        }),
      ]);
    });
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'twilio_phone'),
    ]);
  }
};
