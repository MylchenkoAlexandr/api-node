const RecordsService = require('../services/records.service');

class RecordsController {
    async getAllRecords(req, res) {
        try {
            const records = await RecordsService.getAll();
            return res.status(200).json({ status: "success", message: "All records sending", records });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async getAllRecordsById(req, res) {
        try {
            if (req.params.lead_id) {
                const records = await RecordsService.getAllRecordsById(req.params.lead_id);
                return res.status(200).json({ status: "success", message: "All records sending", records });
            }

            return res.status(400).json({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async getRecordsByMinDuration(req, res) {
        try {
            const records = await RecordsService.getRecordsByMinDuration(req.params.duration);
            return res.status(200).json({ status: "success", message: "All records sending", records });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async getOneRecord(req, res) {
        try {
            const record = await RecordsService.getOne(req.params.record_id);
            return res.status(200).json({ status: "success", message: "Record ready", record });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new RecordsController;