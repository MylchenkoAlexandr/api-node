const db = require('../../database/models');
const TransformationHelper = require('../helpers/transformation.helper');

const RecordsRepository = {
    async getAll(lead_id) {
        try {
            let records = await db.sequelize.query(`SELECT records.id, CONCAT(users.fname, ' ' , users.lname) as fullname, records.createdAt, records.url, records.transcription_text AS text FROM records INNER JOIN users ON records.user_id = users.id WHERE lead_id = ${lead_id}`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            records.forEach(record => {
                record.createdAt = TransformationHelper.formatDate(record.createdAt, true);
            });

            return records;
        } catch (error) {
            throw error;
        }
    },
    async getOne(record_id) {
        try {
            let record = await db.sequelize.query(`SELECT records.id, CONCAT(users.fname, ' ' , users.lname) as fullname, records.createdAt, records.url, records.transcription_text AS text FROM records INNER JOIN users ON records.user_id = users.id WHERE records.id = ${record_id}`, {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

            record.createdAt = TransformationHelper.formatDate(record.createdAt, true);

            return record;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RecordsRepository