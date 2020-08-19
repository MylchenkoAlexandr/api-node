'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Leads extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Leads.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT.UNSIGNED
        },
        // user_id: {

        // },
        // source_id: {

        // },
        // status_id: {
            
        // },
        // price_id: {

        // },
        // type_id: {

        // },
        // email: {

        // },
        // property: {

        // }
    }, {
        sequelize,
        modelName: 'Leads',
    });
    return Leads;
};