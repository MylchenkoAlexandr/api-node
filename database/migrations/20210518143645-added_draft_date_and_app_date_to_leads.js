'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('leads', 'draft_date', {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
          after: "post_sale",
        }), queryInterface.addColumn('leads', 'app_date', {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
          after: "draft_date",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('leads', 'draft_date'),
      queryInterface.removeColumn('leads', 'app_date'),
    ]);
  }
};
