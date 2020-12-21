'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CustomScripts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CustomScripts.belongsTo(models.Users, {
                foreignKey: {
                    name: 'user_id'
                }
            });
            CustomScripts.belongsTo(models.Types, {
                foreignKey: {
                    name: 'type_id'
                }
            });
        }
    };
    CustomScripts.init({
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        type_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'CustomScripts',
        freezeTableName: true,
        tableName: 'custom_scripts',
    });
    return CustomScripts;
};