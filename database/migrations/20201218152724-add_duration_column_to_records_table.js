'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('records', 'duration', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
          after: "transcription_text",
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('records', 'duration'),
    ]);
  }
};
