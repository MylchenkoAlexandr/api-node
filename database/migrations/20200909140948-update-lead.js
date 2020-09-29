'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('leads', 'empty', {
        type: Sequelize.BOOLEAN,
        after: "state_id",
        default: true,
        defaultValue: 0,
        allowNull: true
      }),
      queryInterface.changeColumn('leads', 'source_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      }),
      queryInterface.changeColumn('leads', 'state_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      }),
      queryInterface.changeColumn('leads', 'type_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('leads', 'empty'),
      queryInterface.changeColumn('leads', 'source_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      }),
      queryInterface.changeColumn('leads', 'state_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      }),
      queryInterface.changeColumn('leads', 'type_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      }),
    ]);
  }
};
