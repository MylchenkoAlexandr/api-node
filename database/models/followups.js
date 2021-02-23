'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Followups extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    };
    Followups.init({
        user_id: DataTypes.BIGINT.UNSIGNED,
        lead_id: DataTypes.BIGINT.UNSIGNED,
        completed: DataTypes.BOOLEAN,
        priority: DataTypes.INTEGER,
        datetime: DataTypes.DATE,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Followups',
        freezeTableName: true,
        tableName: 'followups',
    });
    return Followups;
};