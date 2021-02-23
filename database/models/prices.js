'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Prices.init({
    quoter_id: DataTypes.INTEGER,
    lead_id: DataTypes.INTEGER,
    price: {
      type: DataTypes.STRING,
      get() {
        return JSON.parse(this.getDataValue('price'));
      }
    },
    premium_carrier: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Prices',
    freezeTableName: true,
    tableName: 'prices'
  });
  return Prices;
};