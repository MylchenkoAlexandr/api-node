'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'online', {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: 0,
        after: "active",
      }),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'online'),
    ]);
  }
};
