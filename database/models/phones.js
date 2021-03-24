'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Phones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Phones.init({
    state_id: DataTypes.BIGINT.UNSIGNED,
    codes: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue('codes'));
        }
      },
    phone: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Phones',
    freezeTableName: true,
    tableName: 'phones'
  });
  return Phones;
};