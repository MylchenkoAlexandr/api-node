'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      user_id: {
        references: {
          model: 'Users',
          key: 'id',
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      source_id: {
        allowNull: false,
        references: {
          model: 'Sources',
          key: 'id',
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      status_id: {
        allowNull: false,
        references: {
          model: 'Status',
          key: 'id',
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      type_id: {
        allowNull: false,
        references: {
          model: 'Types',
          key: 'id',
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      email: {
        type: Sequelize.STRING
      },
      property: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('leads');
  }
};