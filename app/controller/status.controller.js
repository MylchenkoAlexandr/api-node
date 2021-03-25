const StatusService = require('../services/status.service');
class StatusController {
    async getAll(req, res){
        try {
            const statuses = await StatusService.getAll();

            if(statuses){
                return res.status(200).json({ statuses: statuses });
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new StatusController;