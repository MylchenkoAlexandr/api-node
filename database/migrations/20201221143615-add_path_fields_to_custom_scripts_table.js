'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('custom_scripts', 'path', {
          type: Sequelize.DataTypes.STRING,
          defaultValue: null,
          after: "type_id",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('custom_scripts', 'path'),
    ]);
  }
};
