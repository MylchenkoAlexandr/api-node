const db = require('../../database/models');
const TransformationHelper = require('../helpers/transformation.helper');

const RecordsRepository = {
    async getAll(lead_id) {
        try {
            let data = await db.sequelize.query(`SELECT CONCAT(users.fname, ' ' , users.lname) as fullname, records.createdAt, records.url, records.transcription_text AS text FROM records INNER JOIN users ON records.user_id = users.id WHERE lead_id = ${lead_id}`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            data.forEach(record => {
                record.createdAt = TransformationHelper.formatDate(record.createdAt, true);
            });

            return data;
        } catch (error) {
            throw error;
        }
    },
    async getOne(id){
        try {
            let data = await db.sequelize.query(`SELECT CONCAT(users.fname, ' ' , users.lname) as fullname, records.createdAt, records.url, records.transcription_text AS text  FROM records INNER JOIN users ON records.user_id = users.id WHERE records.id = ${id}`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            return data[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RecordsRepository