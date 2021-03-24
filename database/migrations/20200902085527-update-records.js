'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('records', 'user_id', {
          type: Sequelize.DataTypes.BIGINT.UNSIGNED,
          after: "id",
          references: {
            model: 'users',
            key: 'id'
          }
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('records', 'user_id', { transaction: t }),
      ]);
    });
  }
};
