'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Sms extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association he
            Sms.belongsTo(models.Users, {
                foreignKey: {
                    name: 'user_id'
                }
            });
        }
    };
    Sms.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT.UNSIGNED
        },
        lead_id: {
            allowNull: true,
            type: DataTypes.BIGINT.UNSIGNED,
        },
        user_id: {
            allowNull: true,
            type: DataTypes.BIGINT.UNSIGNED,
        },
        is_client_message: {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN
        },
        send_status: {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN
        },
        text: {
            allowNull: false,
            notEmpty: true,
            type: DataTypes.TEXT
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'Sms',
        freezeTableName: true,
        tableName: 'sms',
    });
    return Sms;
};