'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Leads extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Leads.belongsTo(models.Users, {
        foreignKey: {
          name: 'user_id'
        }
      });
      Leads.belongsTo(models.States, {
        foreignKey: {
          name: 'state_id'
        },
      }),
      Leads.belongsTo(models.Status, {
        foreignKey: {
          name: 'status_id'
        }
      }),
      Leads.hasOne(models.Prices, {
        foreignKey: {
          name: 'lead_id'
        }
      })
    }
  };
  Leads.init({
    user_id: DataTypes.BIGINT.UNSIGNED,
    source_id: DataTypes.BIGINT.UNSIGNED,
    status_id: DataTypes.BIGINT.UNSIGNED,
    type_id: DataTypes.BIGINT.UNSIGNED,
    state_id: DataTypes.BIGINT.UNSIGNED,
    email: DataTypes.STRING,
    fullname: DataTypes.STRING,
    busy: DataTypes.BOOLEAN,
    busy_agent_id: DataTypes.BIGINT.UNSIGNED,
    property: {
      type: DataTypes.TEXT,
      get() {
        return JSON.parse(this.getDataValue('property'));
      }
    },
  }, {
    sequelize,
    modelName: 'Leads',
    freezeTableName: true,
    tableName: 'leads',
  });
  return Leads;
};