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
        default_phone: {
            type: DataTypes.STRING,
            defaultValue: 0,
        },
        default_voice_mail: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        default_text_message: {
            type: DataTypes.TEXT,
            defaultValue: null
        }
    }, {
        sequelize,
        modelName: 'Settings',
        freezeTableName: true,
        tableName: 'settings',
    });

    return Settings;
};