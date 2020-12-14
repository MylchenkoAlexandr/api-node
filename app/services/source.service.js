const models = require('../../database/models');

class SourceService {
    async getAll(){
        try {
            const sources = await models.Sources.findAll();
            return sources;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SourceService;