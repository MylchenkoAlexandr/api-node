'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Emails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association he
            Emails.belongsTo(models.Users, {
                foreignKey: {
                    name: 'user_id'
                }
            });
        }
    };
    Emails.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT.UNSIGNED
        },
        lead_id: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED,
        },
        user_id: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED,
        },
        is_client_message: {
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
        modelName: 'Emails',
        freezeTableName: true,
        tableName: 'emails',
    });
    return Emails;
};