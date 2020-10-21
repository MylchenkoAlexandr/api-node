const RecordsRepository = require('../repository/records.repository');
const models = require('../../database/models/index');

class RecordsService {

    /**
     * Function for get all records with lead
     * @param {number} lead_id
    */
    async getAll(lead_id) {
        try {
            const records = await RecordsRepository.getAll(lead_id);
            return records;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {*} req 
     * @param {*} res 
     */
    async createRecord(record) {
        try {
            await models.Records.create({
                lead_id: record.leadId,
                datetime: record.datatime,
                call_sid: record.callSid,
                sid: record.sid
            });
        } catch (error) {
            throw error;
        }
    }


}

module.exports = new RecordsService;