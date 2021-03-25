'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AgentsVoiceMails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association he
            AgentsVoiceMails.belongsTo(models.Users, {
                foreignKey: {
                    name: 'user_id'
                }
            });
        }
    };
    AgentsVoiceMails.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT.UNSIGNED
        },
        user_id: {
            allowNull: true,
            type: DataTypes.BIGINT.UNSIGNED,
        },
        voice_mail: {
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
        modelName: 'AgentsVoiceMails',
        freezeTableName: true,
        tableName: 'agents_voice_mails',
    });
    return AgentsVoiceMails;
};