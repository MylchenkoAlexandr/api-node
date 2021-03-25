'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'uncompleted_lead', {
          type: Sequelize.DataTypes.BIGINT.UNSIGNED,
          defaultValue: null,
          allowNull: true,
          after: "not_assign",
          references: {
            model: 'leads',
            key: 'id',
          },
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'uncompleted_lead'),
    ]);
  }
};
