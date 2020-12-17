const SourceService = require('../services/source.service');
class SourceController {
    async getAll(req, res){
        try {
            const sources = await SourceService.getAll();

            if(sources){
                return res.status(200).json({ sources: sources });
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new SourceController;