const RecordsService = require('../services/records.service');

async function getAllRecords(req, res) {
    try {
        const records = await RecordsService.getAll();
        return res.status(200).json({ status: "success", message: "All records sending", records });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

async function getRecordsByMinDuration(req, res) {
    try {
        const records = await RecordsService.getRecordsByMinDuration(req.params.duration);
        return res.status(200).json({ status: "success", message: "All records sending", records });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

async function getOneRecord(req, res) {
    try {
        const record = await RecordsService.getOne(req.params.record_id);
        return res.status(200).json({ status: "success", message: "Record already", record });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw error;
    }
}

module.exports = {
    getAllRecords,
    getRecordsByMinDuration,
    getOneRecord
}