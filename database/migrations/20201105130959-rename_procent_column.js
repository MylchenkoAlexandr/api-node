'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.renameColumn('beneficiaries', 'procent', 'percent');
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.renameColumn('beneficiaries', 'percent', 'procent');
  }
};
