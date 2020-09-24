const RecordsRepository = require('../repository/RecordsRepository');

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
}

module.exports = new RecordsService;