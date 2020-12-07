'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('conferences', 'agent_id', {
          after: "caller_id",
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        }),
        queryInterface.renameColumn('conferences', 'caller_id', 'guide_id')
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('conferences', 'agent_id'),
      queryInterface.renameColumn('conferences', 'guide_id', 'caller_id')
    ]);
  }
};
