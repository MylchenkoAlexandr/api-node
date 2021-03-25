'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Subroles extends Model {
        static associate(models) {
        }
    };
    Subroles.init({
        name: DataTypes.STRING,
        title: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Subroles',
        freezeTableName: true,
        tableName: 'subroles'
    });
    return Subroles;
};