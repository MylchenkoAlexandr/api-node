const db = require('../../database/models');
const TransformationHelper = require('../helpers/transformation.helper');

const RecordsRepository = {
    async getAll() {
        try {
            let records = await db.sequelize.query(`SELECT records.id, CONCAT(users.fname, ' ' , users.lname) as agentName, leads.fullname as leadName, records.createdAt, records.url, records.lead_id, records.transcription_text AS text FROM records INNER JOIN users ON records.user_id = users.id INNER JOIN leads ON records.lead_id = leads.id`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            // records.forEach(record => {
            //     record.createdAt = TransformationHelper.formatDate(record.createdAt, true);
            // });

            return records;
        } catch (error) {
            throw error;
        }
    },

    async getByLeadId(lead_id) {
        try {
            let records = await db.sequelize.query(`SELECT records.id, CONCAT(users.fname, ' ' , users.lname) as agentName, leads.fullname as leadName, records.createdAt, records.url, records.lead_id, records.transcription_text AS text FROM records INNER JOIN users ON records.user_id = users.id INNER JOIN leads ON records.lead_id = leads.id WHERE records.lead_id = ${lead_id}`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            // records.forEach(record => {
            //     record.createdAt = TransformationHelper.formatDate(record.createdAt, true);
            // });

            return records;
        } catch (error) {
            throw error;
        }
    },

    async getRecordById(id) {
        try {
            let record = await db.sequelize.query(`SELECT records.id, CONCAT(users.fname, ' ' , users.lname) as agentName, leads.fullname as leadName, records.createdAt, records.url, records.lead_id, records.transcription_text AS text FROM records INNER JOIN users ON records.user_id = users.id INNER JOIN leads ON records.lead_id = leads.id WHERE records.id = ${id}`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            // record[0].createdAt = TransformationHelper.formatDate(record[0].createdAt, true);

            return record[0];
        } catch (error) {
            throw error;
        }
    },

    async getRecordsByMinDuration(duration) {
        try {
            let records = await db.sequelize.query(`SELECT records.id, CONCAT(users.fname, ' ' , users.lname) as agentName, leads.fullname as leadName, records.createdAt, records.url, records.lead_id, records.transcription_text AS text FROM records INNER JOIN users ON records.user_id = users.id INNER JOIN leads ON records.lead_id = leads.id WHERE records.duration > ${duration} ORDER BY records.createdAt DESC`, {
                type: db.sequelize.QueryTypes.SELECT
            });

            // records.forEach(record => {
            //     record.createdAt = TransformationHelper.formatDate(record.createdAt, true);
            // });

            return records;
        } catch (error) {
            throw error;
        }
    },
    async getOne(record_id) {
        try {
            let record = await db.sequelize.query(`SELECT records.id, CONCAT(users.fname, ' ' , users.lname) as agentName, leads.fullname as leadName, records.createdAt, records.url, records.lead_id, records.transcription_text AS text FROM records INNER JOIN users ON records.user_id = users.id INNER JOIN leads ON records.lead_id = leads.id WHERE records.id = ${record_id}`, {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

            // record.createdAt = TransformationHelper.formatDate(record.createdAt, true);

            return record;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RecordsRepository