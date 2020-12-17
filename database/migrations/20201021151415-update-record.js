'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('records', 'transcription_text', { 
        after: 'url',
        type: Sequelize.DataTypes.TEXT,
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('records', 'transcription_text'),
    ]);
  }
};