'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('settings', 'default_voice_mail', {
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
        after: "autodialler",
      }),
      queryInterface.addColumn('settings', 'default_text_message', {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: null,
        after: "default_voice_mail",
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('settings', 'default_voice_mail'),
      queryInterface.removeColumn('settings', 'default_text_message'),
    ]);
  }
};
