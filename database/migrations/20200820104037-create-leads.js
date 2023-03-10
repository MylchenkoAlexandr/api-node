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
          model: 'users',
          key: 'id',
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      source_id: {
        allowNull: false,
        references: {
          model: 'sources',
          key: 'id',
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      status_id: {
        allowNull: false,
        references: {
          model: 'status',
          key: 'id',
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      type_id: {
        allowNull: false,
        references: {
          model: 'types',
          key: 'id',
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      state_id: {
        allowNull: false,
        references: {
          model: 'states',
          key: 'id',
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      email: {
        type: Sequelize.STRING
      },
      fullname: {
        type: Sequelize.STRING
      },
      property: {
        type: Sequelize.TEXT
      },
      busy: {
        type: Sequelize.BOOLEAN,
        default: true,
        defaultValue: false,
        allowNull: false
      },
      busy_agent_id: {
        references: {
          model: 'users',
          key: 'id',
        },
        type: Sequelize.BIGINT.UNSIGNED
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