'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Records', 'user_id', {
          type: Sequelize.DataTypes.BIGINT.UNSIGNED,
          after: "id",
          references: {
            model: 'Users',
            key: 'id'
          }
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Records', 'user_id', { transaction: t }),
      ]);
    });
  }
};
