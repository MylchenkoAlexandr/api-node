const RecordsRepository = require('../repository/RecordsRepository');

async function getAllRecords(req, res) {
    const records = await RecordsRepository.getAll(req.body.lead_id);
    return res.status(200).json(records);
}

module.exports = {
    getAllRecords
}