'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('leads', 'second_phone', {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
          after: "phone",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('leads', 'second_phone'),
    ]);
  }
};
