'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class beneficiary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  beneficiary.init({
    lead_id: DataTypes.BIGINT.UNSIGNED,
    name: DataTypes.STRING,
    relative_id: DataTypes.BIGINT.UNSIGNED,
    location: DataTypes.BIGINT.UNSIGNED,
    grand_kids: DataTypes.INTEGER,
    work_status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Beneficiary',
    freezeTableName: true,
    tableName: 'beneficiary',
  });
  return beneficiary;
};