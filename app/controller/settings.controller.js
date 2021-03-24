const SettingsService = require('../services/settings.service');

class SettingsController {
    async getSettings(req, res) {
        try {
            const settings = await SettingsService.get();
            return res.status(200).json({
                settings
            });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async update(req, res) {
        try {
            if ('assignment' in req.body) {
                const response = await SettingsService.update(req.body);
                return res.status(response.code).json({ status: response.status, message: response.message });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }
    async updateFields(req, res) {
        try {
            const data = req.body;
            if ("fields" in data) {
                await SettingsService.updateFields(data.fields);
                return res.status(200).json({ status: "success", message: "Success updated!"});
            }
            return res.status(400).json({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    };
}

module.exports = new SettingsController;