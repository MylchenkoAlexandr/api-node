'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UsersSubroles extends Model {
        static associate(models) {
        }
    };
    UsersSubroles.init({
        user_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
        subrole_id: DataTypes.BIGINT.UNSIGNED
    }, {
        sequelize,
        modelName: 'UsersSubroles',
        freezeTableName: true,
        tableName: 'users_subroles'
    });
    return UsersSubroles;
};