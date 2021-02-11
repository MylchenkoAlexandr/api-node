'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'email_credentials', {
          type: Sequelize.DataTypes.TEXT,
          defaultValue: '',
          after: "email",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'email_credentials'),
    ]);
  }
};
