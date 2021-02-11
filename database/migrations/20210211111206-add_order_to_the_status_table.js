'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('status', 'order', {
          type: Sequelize.DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          after: "title",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('status', 'order'),
    ]);
  }
};
