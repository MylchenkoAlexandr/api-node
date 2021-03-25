'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'phone', {
          type: Sequelize.DataTypes.STRING,
          defaultValue: null,
          after: "email",
        }),        
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'phone'),
    ]);
  }
};
