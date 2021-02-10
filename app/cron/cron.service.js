const models = require("../../database/models");

class CronService {
    async followUpsNotification() {
        const followups = await models.Followups.findAll(where)
    }
}

module.exports = new CronService;