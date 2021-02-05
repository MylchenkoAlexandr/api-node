'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sms_tmp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      sms_tmp.belongsTo(models.Users, {
        foreignKey: {
            name: 'user_id'
        }
    });
    }
  };
  sms_tmp.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED
    },
    user_id: {
      allowNull: true,
      type: DataTypes.BIGINT.UNSIGNED,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    text: {
      allowNull: false,
      notEmpty: true,
      type: DataTypes.TEXT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'sms_tmp',
    freezeTableName: true,
    tableName: 'sms_tmp',
  });
  return sms_tmp;
};