'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Records extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Records.init({
    user_id: DataTypes.BIGINT.UNSIGNED,
    lead_id: DataTypes.BIGINT.UNSIGNED,
    datetime: DataTypes.DATE,
    call_sid: DataTypes.STRING,
    sid: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Records',
    freezeTableName: true,
    tableName: 'records'
  });
  return Records;
};