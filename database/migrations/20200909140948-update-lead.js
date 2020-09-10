'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Leads', 'empty', {
        type: Sequelize.BOOLEAN,
        after: "state_id",
        default: true,
        defaultValue: 0,
        allowNull: true
      }),
      queryInterface.changeColumn('Leads', 'source_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      }),
      queryInterface.changeColumn('Leads', 'state_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      }),
      queryInterface.changeColumn('Leads', 'type_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Leads', 'empty'),
      queryInterface.changeColumn('Leads', 'source_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      }),
      queryInterface.changeColumn('Leads', 'state_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      }),
      queryInterface.changeColumn('Leads', 'type_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      }),
    ]);
  }
};
