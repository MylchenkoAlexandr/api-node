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
      // define association here
    }
  };
  Leads.init({
    user_id: DataTypes.BIGINT.UNSIGNED,
    source_id: DataTypes.BIGINT.UNSIGNED,
    status_id: DataTypes.BIGINT.UNSIGNED,
    type_id: DataTypes.BIGINT.UNSIGNED,
    state_id: DataTypes.BIGINT.UNSIGNED,
    email: DataTypes.STRING,
    property: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Leads',
    freezeTableName: true,
    tableName: 'leads',
  });
  return Leads;
};