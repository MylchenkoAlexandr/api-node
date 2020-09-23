'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersStates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UsersStates.init({
    user_id: DataTypes.BIGINT.UNSIGNED,
    state_id: DataTypes.BIGINT.UNSIGNED
  }, {
    sequelize,
    modelName: 'UsersStates',
    freezeTableName: true,
    tableName: 'users_states'
  });
  return UsersStates;
};