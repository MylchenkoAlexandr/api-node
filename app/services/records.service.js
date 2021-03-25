const RecordsRepository = require('../repository/records.repository');
const models = require('../../database/models/index');

class RecordsService {

    /**
     * Get all records for lead
     */
    async getAll() {
        try {
            return await RecordsRepository.getAll();
        } catch (error) {
            throw error;
        }
    }

    async getRecordsByMinDuration(duration) {
        try {
            return await RecordsRepository.getRecordsByMinDuration(duration);
        } catch (error) {
            throw error;
        }
    };

    /**
     * Get one record
     * @param {number} record_id
    */
    async getOne(record_id) {
        try {
            const record = await RecordsRepository.getOne(record_id);

            return record;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create record
     * @param {object} record
    */
    async createRecord(record) {
        try {
            return await models.Records.create({
                lead_id: record.leadId,
                datetime: record.datatime,
                call_sid: record.callSid,
                duration: record.duration,
                sid: record.sid
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Save the transcription text for certain record url
     * @param {string} recordingUrl
     * @param {string} transcriptionText
    */
    async saveTranscriptionText(recordingUrl, transcriptionText) {
        try {
            return await models.Records.update({
                transcription_text: transcriptionText
            }, { where: { url: recordingUrl } });
        } catch (error) {
            throw error;
        }
    }

    async getAllRecordsById(lead_id){
        try {
            return await RecordsRepository.getByLeadId(lead_id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new RecordsService;