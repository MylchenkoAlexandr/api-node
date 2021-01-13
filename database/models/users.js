'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Users.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    AD_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    INBOUND_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    online: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    in_call: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    role_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twilio_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    states: DataTypes.TEXT,
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    not_assign: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    uncompleted_lead: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: null,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Users',
    freezeTableName: true,
    tableName: 'users'
  });
  return Users;
};