'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("UPDATE leads INNER JOIN status ON leads.status_id = status.id SET leads.post_sale = 1 WHERE status.name='in-force' OR status.name='purchased'");
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.sequelize.query("UPDATE leads INNER JOIN status ON leads.status_id = status.id SET leads.post_sale = 0 WHERE status.name='in-force' OR status.name='purchased'");
  }
};
