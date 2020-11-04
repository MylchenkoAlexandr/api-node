'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class beneficiaries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  beneficiaries.init({
    lead_id: DataTypes.BIGINT.UNSIGNED,
    number: DataTypes.INTEGER,
    name: DataTypes.STRING,
    relative_id: DataTypes.BIGINT.UNSIGNED,
    dob: DataTypes.STRING,
    location_id: DataTypes.BIGINT.UNSIGNED,
    grand_kids: DataTypes.INTEGER,
    work_status: DataTypes.STRING,
    percent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Beneficiaries',
    freezeTableName: true,
    tableName: 'beneficiaries',
  });
  return beneficiaries;
};