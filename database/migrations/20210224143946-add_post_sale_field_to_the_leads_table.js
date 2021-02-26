'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('leads', 'post_sale', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
          after: "busy_agent_id",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('leads', 'busy_agent_id'),
    ]);
  }
};
