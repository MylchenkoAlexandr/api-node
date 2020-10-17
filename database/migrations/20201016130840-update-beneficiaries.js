'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('beneficiaries', 'number', { 
        after: 'lead_id',
        type: Sequelize.INTEGER,
        allowNull: false
      }),
      queryInterface.addColumn('beneficiaries', 'procent', { 
        after: 'work_status',
        type: Sequelize.INTEGER,
        allowNull: false
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('beneficiaries', 'number'),
      queryInterface.removeColumn('beneficiaries', 'procent'),
    ]);
  }
};
