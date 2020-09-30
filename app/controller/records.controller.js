const RecordsService = require('../services/records.service');

async function getAllRecords(req, res) {
    try {
        const records = await RecordsService.getAll(req.params.lead_id);
        return res.status(200).json({ status: "success", message: "All records sending", records });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

module.exports = {
    getAllRecords
}