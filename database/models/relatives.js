'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Relatives extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Relatives.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Relatives',
    freezeTableName: true,
    tableName: 'relatives',
  });
  return Relatives;
};