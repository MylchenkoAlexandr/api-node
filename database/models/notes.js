'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Notes.init({
    user_id: DataTypes.BIGINT.UNSIGNED,
    lead_id: DataTypes.BIGINT.UNSIGNED,
    message: DataTypes.STRING(5000)
  }, {
    sequelize,
    modelName: 'Notes',
    freezeTableName: true,
    tableName: 'notes',
  });
  return Notes;
};