'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('beneficiaries', 'dob', { 
        after: 'relative_id',
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('beneficiaries', 'dob')
    ]);
  }
};
