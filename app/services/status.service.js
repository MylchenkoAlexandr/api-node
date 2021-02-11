const models = require('../../database/models');

class StatusService {
    async getAll(){
        try {
            const statuses = await models.Status.findAll({
                order: [
                    ['order', 'ASC']
                ]
            });
            return statuses;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StatusService;