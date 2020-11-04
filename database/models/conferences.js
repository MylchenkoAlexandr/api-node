'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class conferences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  conferences.init({
    active: DataTypes.BOOLEAN,
    lead_id: DataTypes.BIGINT.UNSIGNED,
    caller_id: DataTypes.BIGINT.UNSIGNED,
    conferenceId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'conferences',
  });
  return conferences;
};