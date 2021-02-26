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
      });
      Leads.belongsTo(models.Status, {
        foreignKey: {
          name: 'status_id'
        }
      });
      Leads.belongsTo(models.Sources, {
        foreignKey: {
          name: 'source_id'
        },
        as: 'source'
      });
      Leads.hasOne(models.Prices, {
        foreignKey: {
          name: 'lead_id'
        }
      });
      Leads.hasOne(models.Users, {
        foreignKey: {
          name: 'uncompleted_lead'
        }
      });
    }
  };
  Leads.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    },
    AD_status: DataTypes.BOOLEAN,
    AD_procced: DataTypes.BOOLEAN,
    CRON_hours: DataTypes.INTEGER,
    user_id: DataTypes.BIGINT.UNSIGNED,
    source_id: DataTypes.BIGINT.UNSIGNED,
    status_id: DataTypes.BIGINT.UNSIGNED,
    type_id: DataTypes.BIGINT.UNSIGNED,
    state_id: DataTypes.BIGINT.UNSIGNED,
    empty: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    email_sended: DataTypes.BOOLEAN,
    phone: DataTypes.STRING,
    fullname: DataTypes.STRING,
    busy: DataTypes.BOOLEAN,
    busy_agent_id: DataTypes.BIGINT.UNSIGNED,
    post_sale: DataTypes.BOOLEAN,

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