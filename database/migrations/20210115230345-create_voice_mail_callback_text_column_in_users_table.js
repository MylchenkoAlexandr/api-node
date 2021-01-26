'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'text_message', {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: null,
        after: "active",
      }),
      queryInterface.addColumn('users', 'voice_mail', {
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
        after: "text_message",
      }),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'text_message'),
      queryInterface.removeColumn('users', 'voice_mail'),
    ]);
  }
};
