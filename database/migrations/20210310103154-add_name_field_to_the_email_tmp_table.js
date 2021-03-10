'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('email_tmp', 'name', {
          type: Sequelize.DataTypes.STRING,
          defaultValue: "New template",
          allowNull: false,
          after: "user_id",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('email_tmp', 'name'),
    ]);
  }
};
