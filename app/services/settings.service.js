const models = require('../../database/models');

class SettingsService {
    async get() {
        try {
            const settings = await models.Settings.findAll({
                limit: 1
            });
            return settings[0];
        } catch (error) {
            throw error;
        }
    }

    async update(updateSettings) {
        try {
            const settings = await models.Settings.findAll({
                limit: 1
            });

            await settings[0].update({
                assignment: +updateSettings.assignment,
                default_phone: updateSettings.default_phone
            });

            return {
                code: 200,
                message: "Settings updated",
                status: 'success'
            };
        } catch (error) {
            throw error;
        }
    }

    async updateFields(fields) {
        try {
            await models.Settings.update(fields, { where: { id: 1 } }).then(() => {
                return {
                    code: 200,
                    message: "Settings updated",
                    status: 'success'
                };
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SettingsService;