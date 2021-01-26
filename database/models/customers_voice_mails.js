'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CustomersVoiceMails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CustomersVoiceMails.belongsTo(models.Users, {
                foreignKey: {
                    name: 'lead_id'
                }
            });
        }
    };
    CustomersVoiceMails.init({
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
        url: {
            defaultValue: false,
            type: DataTypes.STRING
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
        modelName: 'CustomersVoiceMails',
        freezeTableName: true,
        tableName: 'customers_voice_mails',
    });
    return CustomersVoiceMails;
};