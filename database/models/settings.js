'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Settings extends Model {
        static associate(models) {
        }
    };
    Settings.init({
        assignment: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
        },
    }, {
        sequelize,
        modelName: 'Settings',
        freezeTableName: true,
        tableName: 'settings',
    });

    return Settings;
};